import { Request, Response } from 'express'
import { getCustomRepository, getManager, getRepository } from 'typeorm';
import { FormaPagamento, ItemVenda, Status, Venda } from '../models/Venda';
import { Endereco } from '../models/Endereco';
import { VendaRepository } from '../repositorios/VendaRepository';
import { Produto } from '../models/Produto';
import { ControlePessoa } from './ControlePessoa';
import moment from 'moment';
import { AppError } from '../errors/AppError';
import { ControleEstoque } from './ControleEstoque';
import { validar, validarComGrupos } from '../services/validaDados';

class ControleVenda {
    async adicionar(request: Request, response: Response) {
        const { valorFrete, idPessoa } = request.body
        const formaPagamento: FormaPagamento = request.body.formaPagamento
        const destino: Endereco = request.body.destino
        const produtos: Produto[] = request.body.produtos

        try {

            const vendaRepository = getCustomRepository(VendaRepository)

            await getManager().transaction(async manager => {
                const itens = await vendaRepository.calculaTotaisItens(produtos)
                const subtotal = await vendaRepository.calculaSubtotalVenda(itens)

                const controlePesssoa = new ControlePessoa()
                const pessoaExiste = await controlePesssoa.buscaPessoa(idPessoa)

                const venda = manager.create(Venda, {
                    valorFrete: valorFrete,
                    subtotal,
                    valorTotal: subtotal + valorFrete,
                    formaPagamento: await manager.save(
                        manager.create(FormaPagamento,
                            {
                                nomeTitular: formaPagamento.nomeTitular,
                                dtVencimento: moment().add(7, 'days').format('YYYY-MM-DD')
                            })
                    ),
                    destino,
                    pessoa: pessoaExiste,
                    codRastreio: null,
                })

                await validarComGrupos(venda, [''])

                const vendaSalva = await manager.save(venda)

                const controleEstoque = new ControleEstoque()
                let prodsIndisponiveis: AppError[]

                for (const item of itens) {
                    await manager.save(
                        manager.create(ItemVenda, {
                            produto: item.produto,
                            quantidade: item.quantidade,
                            valorSubTotal: item.valorSubTotal,
                            valorUnit: item.valorUnit,
                            venda: vendaSalva
                        }))

                    // const estoque = await controleEstoque.buscaEstoque(item.produto)

                    // if (!await controleEstoque.consultaDisponibilidade(item.produto)) {
                    //     prodsIndisponiveis.push(new AppError(`${item.produto.nome} nao disponivel`, 'produto'))
                    // }
                    // await controleEstoque.retiraDoEstoque(estoque, manager, item.quantidade)
                }

                // if (prodsIndisponiveis.length > 0) throw prodsIndisponiveis
            })

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
            await getManager().transaction(async manager => {

                if (vendaExiste.status == Status.EM_APROVACAO || vendaExiste.status == Status.COMPRA_APROVADA) {
                    vendaExiste.status = Status.PEDIDO_CANCELADO

                    await manager.save(vendaExiste)
                        .catch((error) => { throw error })

                    // const controleEstoque = new ControleEstoque()
                    // vendaExiste.itensVenda.map(async item => {
                    //     const estoque = await controleEstoque.buscaEstoque(item.produto)
                    //     await controleEstoque.adicionaAoEstoque(estoque, manager, item.quantidade)
                    // })
                } else {
                    throw new AppError('Não é possivel cancelar, o pedido ja foi enviado!', 'venda')
                }
            })

            return response.status(200).json({ message: 'Compra cancelada com sucesso!' })
        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async adicionarCodRastreio(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const { idVenda, codRastreio } = request.body;

        try {
            const vendaExiste = await vendaRepo.findOne(idVenda)

            if (!vendaExiste) throw new AppError('Venda não existe', 'venda')

            if (vendaExiste.status == Status.COMPRA_APROVADA || vendaExiste.status == Status.PEDIDO_ENVIADO) {
                vendaExiste.codRastreio = codRastreio

                await validarComGrupos(vendaExiste, ['codRastreio'])

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

    async listarVendas(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const query = request.query.pagina
        const pagina = query ? parseInt(query.toString()) : 1
        const itensPorPagina: number = 3

        try {
            vendaRepo.listarVendasPrioritarias(pagina, itensPorPagina)
                .then((vendas) => {
                    if (vendas[0].length > 0) {
                        vendas[1] = Math.ceil(vendas[1] / itensPorPagina);
                        const data = {
                            vendas: vendas[0],
                            nPages: vendas[1]
                        }
                        return response.status(200).json(data)
                    } else {
                        throw new AppError('Nenhum pedido encontrado', 'pedido')
                    }
                }).catch(err => { return response.status(400).json(err) })
        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async listarPorPessoa(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const { idPessoa } = request.params
        const query = request.query.pagina
        const pagina = query ? parseInt(query.toString()) : 1
        const itensPorPagina: number = 5

        try {
            vendaRepo.buscaPorId(idPessoa, pagina, itensPorPagina)
                .then((vendas) => {
                    if (vendas[0].length > 0) {
                        vendas[1] = Math.ceil(vendas[1] / itensPorPagina);
                        const data = {
                            vendas: vendas[0],
                            nPages: vendas[1]
                        }
                        return response.status(200).json(data)
                    } else {
                        throw new AppError('Nenhum pedido encontrado', 'pedido')
                    }
                }).catch(err => { return response.status(400).json(err) })

        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async pesquisarVendas(request: Request, response: Response) {
        const vendaRepo = getCustomRepository(VendaRepository)
        const { pesquisa, atributo } = request.params

        try {
            await vendaRepo.pesquisar(pesquisa, atributo)
                .then(res => {
                    if (res.length > 0) {
                        return response.status(200).json(res)
                    } else {
                        throw new AppError('Nenhuma venda encontrada', 'venda')
                    }
                }).catch(err => { return response.status(400).json(err) })
        } catch (error) {
            return response.status(400).json(error)
        }
    }
    // async buscarPorId(request: Request, response: Response) {
    //     const id = request.params.idVenda;
    //     const vendaRepo = getCustomRepository(VendaRepository);

    //     try {
    //         const venda = await vendaRepo.buscaPorId(id);
    //         if (!venda) {
    //             throw new AppError('Venda nao encontrada', 'venda');
    //         }

    //         return response.status(200).json(venda);
    //     } catch (error) {
    //         return response.status(400).json(error);
    //     }
    // }
}


export { ControleVenda };