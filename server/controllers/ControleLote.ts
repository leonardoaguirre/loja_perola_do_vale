import { validateOrReject } from "class-validator";
import { Request } from "express";
import { EntityManager, getRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Estoque, Lote } from "../models/Estoque";
import { Fornecedor } from "../models/Fornecedor";
import { validar } from '../services/validaDados'

class ControleLote {
    async adiciona(request: Request, estoque: Estoque, fornecedor: Fornecedor, manager: EntityManager) {
        const { quantidade, dtCompra} = request.body

        try {
            const lote = manager.create(Lote,{
                dtCompra: new Date(String(dtCompra).replace('-','/')),
                quantidade,
                estoque,
                fornecedor,
            })
            
            await validar(lote)

            return await manager.save(lote)
        } catch (error) {
            throw error
        }
    }
    async deleta(request: Request, manager: EntityManager) {
        const loteRepo = getRepository(Lote)
        const { idLote } = request.body

        const lote = await loteRepo.findOne({ where: { id: idLote }, relations: ['estoque'] },)
        if (!lote) throw new AppError('Nenhum lote encontrado', 'lote')

        await manager.delete(Lote, lote.id)

        return lote
    }

    async alterar(request: Request, manager: EntityManager) {
        const { idLote, quantidade, dtCompra, idFornecedor, idEstoque } = request.body
        const loteRepo = getRepository(Lote)

        const lote = await loteRepo.findOne({ where: { id: idLote } })

        manager.merge(Lote, lote, {
            quantidade,
            dtCompra: new Date(dtCompra),
            fornecedor: { id: idFornecedor },
            estoque: { id: idEstoque }
        })

        await validar(lote)
        return await manager.save(lote)
    }
    async listarLotes(idEstoque: string) {
        const loteRepo = getRepository(Lote)

        const lotes = await loteRepo.find({ where: { estoque: { id: idEstoque } } })
        if (!lotes) throw new AppError('Nenhum lote encontrado', 'lote')

        return lotes
    }
    async buscaLote(idLote: string) {
        const loteRepo = getRepository(Lote)

        const lotes = await loteRepo.findOne({ where: { id: idLote } })
        if (!lotes) throw new AppError('Lote não encontrado', 'lote')

        return lotes
    }
}

export { ControleLote }