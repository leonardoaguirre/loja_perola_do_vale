import { Request, Response } from "express";
import { EntityManager, getCustomRepository, getManager } from "typeorm";
import { AppError } from "../errors/AppError";
import { validar } from "../services/validaDados"
import { EstoqueRepository } from "../repositorios/EstoqueRepository";
import { ControleFornecedor } from "./ControleFornecedor";
import { ControleLote } from "./ControleLote";
import { ControleProduto } from "./ControleProduto";
import { Estoque } from "../models/Estoque";
import { Produto } from "../models/Produto";


class ControleEstoque {
    async adicionarLoteAoEstoque(request: Request, response: Response) {
        const { idProduto, idFornecedor } = request.body
        const controleProd = new ControleProduto()
        const controleFornecedor = new ControleFornecedor()
        const estoqueRepo = getCustomRepository(EstoqueRepository)
        const controleLote = new ControleLote()

        try {
            const prod = await controleProd.buscaProduto(idProduto)

            const fornecedor = await controleFornecedor.buscarFornecedor(idFornecedor)

            await getManager().transaction(async manager => {
                const estoque = await estoqueRepo.verificaEstoque(prod, manager)

                const lote = await controleLote.adiciona(request, estoque, fornecedor, manager)

                await validar(estoque)
                await manager.save(estoque)

                await estoqueRepo.adicionaAoEstoque(estoque, manager, lote.quantidade)
            })

            return response.status(200).json('Lote inserido com sucesso')

        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async alterarLoteAoEstoque(request: Request, response: Response) {
        const { idProduto, idLote, quantidade, idFornecedor, dtCompra } = request.body
        const controleProd = new ControleProduto()
        const controleFornecedor = new ControleFornecedor()
        const estoqueRepo = getCustomRepository(EstoqueRepository)
        const controleLote = new ControleLote()

        try {
            const lote = await controleLote.buscaLote(idLote)

            const prod = await controleProd.buscaProduto(idProduto)

            await controleFornecedor.buscarFornecedor(idFornecedor)

            await getManager().transaction(async manager => {
                const estoque = await estoqueRepo.verificaEstoque(prod, manager)

                const loteAlterado = await controleLote.alterar(request, manager)

                await estoqueRepo.atualizaEstoque(estoque, manager, lote, loteAlterado)
            })

            return response.status(200).json('Lote alterado com sucesso')

        } catch (error) {
            return response.status(400).json(error)
        }
    }


    async retiraDoEstoque(estoque: Estoque, manager: EntityManager, quantidade: number) {
        const estoqueRepo = getCustomRepository(EstoqueRepository)

        try {
            await estoqueRepo.retiraDoEstoque(estoque, manager, quantidade)
        } catch (error) {
            throw error
        }
    }

    async adicionaAoEstoque(estoque: Estoque, manager: EntityManager, quantidade: number) {
        const estoqueRepo = getCustomRepository(EstoqueRepository)

        try {
            await estoqueRepo.adicionaAoEstoque(estoque, manager, quantidade)
        } catch (error) {
            throw error
        }
    }

    async buscaEstoque(prod: Produto) {
        const estoqueRepo = getCustomRepository(EstoqueRepository);
        
        try {
            const estoque = await estoqueRepo.findOne({ where: { produto: prod } })
            
            if (!estoque) {
                throw new AppError(`Estoque não encontrado para o produto ${prod.nome}`, 'estoque');
            }
            return estoque;

        } catch (error) {
            throw error;
        }
    }

    async listar(request: Request, response: Response) {
        const estoqueRepo = getCustomRepository(EstoqueRepository)

        estoqueRepo.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhuma venda encontrada', 'venda'));
                }
            })
    }

    async removerLote(request: Request, response: Response) {
        const controleLote = new ControleLote()
        const estoqueRepo = getCustomRepository(EstoqueRepository)

        try {
            await getManager().transaction(async manager => {
                const lote = await controleLote.deleta(request, manager)
                console.log(lote);

                estoqueRepo.retiraDoEstoque(lote.estoque, manager, lote.quantidade)
            })

            return response.status(200).json('Lote removido com sucesso')
        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async listarLotes(request: Request, response: Response) {
        const controleLote = new ControleLote()
        const { idEstoque } = request.params

        try {
            const lotes = await controleLote.listarLotes(idEstoque)

            return response.status(200).json(lotes)
        } catch (error) {
            return response.status(400).json(error)
        }

    }
    async consultaDisponibilidade(produto: Produto) {
        const estoqueRepo = getCustomRepository(EstoqueRepository)

        try {
            return await estoqueRepo.consultaDisponibilidade(produto)
        } catch (error) {
            throw error
        }
    }
}

export { ControleEstoque }