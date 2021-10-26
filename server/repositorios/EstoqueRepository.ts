import { validate, validateOrReject } from "class-validator";
import { EntityManager, EntityRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Estoque, Lote } from "../models/Estoque";
import { Produto } from "../models/Produto";

@EntityRepository(Estoque)
class EstoqueRepository extends Repository<Estoque>{
    async buscaPorId(busca: string) {
        return this.findOne({
            where: {
                id: busca
            }
        })
    }
    // async buscaExistente(prod: Produto) {
    //     return this.findOne({
    //         where: [
    //             { produto: prod }
    //         ]
    //     })
    // }
    async validaDados(estoque: Estoque) {
        try {
            await validateOrReject(estoque, { validationError: { target: false } })
        } catch (error) {
            throw error
        }
    }
    async verificaEstoque(prod: Produto, manager: EntityManager) {
        try {
            let estoque = await this.findOne({
                where: [
                    { produto: prod }
                ]
            })

            if (!estoque) {
                estoque = await manager.save(
                    manager.create(Estoque,
                        {
                            produto: prod,
                            quantidadeDisponivel: 0
                        }
                    )
                )
            }
            return estoque;

        } catch (error) {
            throw error;
        }

    }
    async consultaDisponibilidade(prod: Produto) {
        const estoque = await this.findOne({ where: { produto: prod } })

        if (!estoque || estoque.quantidadeDisponivel < 1) return false

        return true
    }

    async retiraDoEstoque(estoque: Estoque, manager: EntityManager, quantidade: number) {
        try {
            if (estoque.quantidadeDisponivel < quantidade) throw new AppError("Quantidade a retirar do estoque não disponivel", 'Estoque')

            await manager.decrement(Estoque, estoque, 'quantidadeDisponivel', quantidade)
        } catch (error) {
            throw error
        }
    }

    async adicionaAoEstoque(estoque: Estoque, manager: EntityManager, quantidade: number) {
        try {
            await manager.increment(Estoque, estoque, 'quantidadeDisponivel', quantidade)
        } catch (error) {
            throw error
        }
    }

    async atualizaEstoque(estoque: Estoque, manager: EntityManager, loteAntigo: Lote, loteAlterado: Lote) {
        try {
            manager.merge(Estoque, estoque, {
                quantidadeDisponivel: (estoque.quantidadeDisponivel - loteAntigo.quantidade) + Number(loteAlterado.quantidade)
            })
            await manager.save(estoque)

        } catch (error) {
            throw error
        }
    }
}

export { EstoqueRepository }