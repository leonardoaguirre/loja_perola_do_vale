import { Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm';
import { FormaPagamento, ItemVenda } from '../models/Venda';
import { Endereco } from '../models/Endereco';
import { VendaRepository } from '../repositorios/VendaRepository';
import { Produto } from '../models/Produto';
import { ControlePessoa } from './ControlePessoa';
import moment from 'moment';

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

            return response.status(200).json({ message: 'Compra realizada com sucesso!' })

        } catch (error) {
            return response.status(400).json(error)
        }

    }

}
export { ControleVenda };