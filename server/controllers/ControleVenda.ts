import { Request, Response } from 'express'
import { getCustomRepository, getManager, getRepository } from 'typeorm';
import { FormaPagamento, ItemVenda, Status, Venda } from '../models/Venda';
import { Endereco } from '../models/Endereco';
import { VendaRepository } from '../repositorios/VendaRepository';
import { Produto } from '../models/Produto';
import { ControlePessoa } from './ControlePessoa';
import moment from 'moment';
import { AppError } from '../errors/AppError';

class ControleVenda {
    async adicionar(request: Request, response: Response) {
        const { valorFrete, idPessoa } = request.body
        const formaPagamento: FormaPagamento = request.body.formaPagamento
        const destino: Endereco = request.body.destino
        const produtos: Produto[] = request.body.produtos

        try {

            const vendaRepository = getCustomRepository(VendaRepository)
            const pagamentoRepo = getRepository(FormaPagamento)
            const itemRepo = getRepository(ItemVenda)

            await getManager().transaction(async () => {
                const itens = await vendaRepository.calculaTotaisItens(produtos)
                const subtotal = await vendaRepository.calculaSubtotalVenda(itens)

                const controlePesssoa = new ControlePessoa()
                const pessoaExiste = await controlePesssoa.buscaPessoa(idPessoa)

                const venda = vendaRepository.create({
                    valorFrete: valorFrete,
                    subtotal,
                    valorTotal: subtotal + valorFrete,
                    formaPagamento: await pagamentoRepo.save({
                        nomeTitular: formaPagamento.nomeTitular,
                        dtVencimento: moment().add(7, 'days').format('YYYY-MM-DD')
                    }),
                    destino,
                    pessoa: pessoaExiste,
                    codRastreio: '',
                    itensVenda: await itemRepo.save(itens),
                })

                const erros = await vendaRepository.validaDados(venda)
                if (erros.length > 0) {
                    throw erros
                }

                await vendaRepository.save(venda)
            });

            return response.status(200).json({ message: 'Compra realizada com sucesso!' })

        } catch (error) {
            return response.status(400).json(error)
        }

    }

    async cancelar(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const idVenda = request.params.idVenda;

        try {
            const vendaExiste = await vendaRepo.findOne(idVenda)

            if (!vendaExiste) throw new AppError('Venda não existe', 'venda')

            if (vendaExiste.status == Status.EM_APROVACAO || vendaExiste.status == Status.COMPRA_APROVADA) {
                vendaExiste.status = Status.PEDIDO_CANCELADO

                vendaRepo.save(vendaExiste)
                    .then(() => {
                        return response.status(200).json({ message: 'Compra cancelada com sucesso!' })
                    }).catch((error) => { throw error })

            } else {
                throw new AppError('Não é possivel cancelar, o pedido ja foi enviado!', 'venda')
            }

        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async adicionarCodRastreio(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const idVenda = request.params.idVenda;
        const codRastreio = request.body.codRastreio;

        try {
            const vendaExiste = await vendaRepo.findOne(idVenda)

            if (!vendaExiste) throw new AppError('Venda não existe', 'venda')

            if (vendaExiste.status == Status.COMPRA_APROVADA) {
                vendaExiste.codRastreio = codRastreio

                const erros = await vendaRepo.validaDados(vendaExiste)
                if (erros.length > 0) throw erros

                vendaExiste.status = Status.PEDIDO_ENVIADO

                vendaRepo.save(vendaExiste)
                    .then(() => {
                        return response.status(200).json({ message: 'O codigo de rastreio foi inserido com sucesso' })
                    }).catch((error) => { throw error })

            } else {
                throw new AppError('Não é possivel inserir o codigo de rastreio', 'venda')
            }

        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async listar(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)

        vendaRepo.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhuma venda encontrada', 'venda'));
                }
            })
    }

    async buscarPorId(request: Request, response: Response) {
        const id = request.params.idVenda;
        const vendaRepo = getCustomRepository(VendaRepository);

        try {
            const venda = await vendaRepo.buscaPorId(id);
            if (!venda) {
                throw new AppError('Venda nao encontrada', 'venda');
            }

            return response.status(200).json(venda);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
}


export { ControleVenda };