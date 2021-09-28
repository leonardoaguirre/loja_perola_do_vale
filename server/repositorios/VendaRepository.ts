import { validate } from "class-validator";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Produto } from "../models/Produto";
import { ItemVenda, Venda } from "../models/Venda";
import { ProdutoRepository } from "./ProdutoRepository";

@EntityRepository(Venda)
class VendaRepository extends Repository<Venda>{
    async validaDados(venda: Venda) {
        return await validate(venda)
    }
    async buscaPorId(id: string) {
        return await this.find({ where: { pessoa: { id: id } } })
    }
    async buscaAPartirDe(dataIni: Date) {

    }
    async buscaEntreDatas(dataIni: Date, dataFim: Date) {

    }
    async calculaTotaisItens(produtos: Produto[]) {
        const prodRepo = getCustomRepository(ProdutoRepository)
        let itensVenda: ItemVenda[] = []
    
        for (const prod of produtos) {
            const prodExist = await prodRepo.buscaPorId(prod.id)
            const subTotal = prodExist.valorVenda * prod.quantidade
            
            itensVenda.push({
                produto: prodExist,
                quantidade: prod.quantidade,
                valorSubTotal: subTotal,
                valorUnit: prodExist.valorVenda,
            })
        }
        return itensVenda
    }
    async calculaSubtotalVenda(itens: ItemVenda[]) {
        let subtotal: number = 0

        for (const item of itens) {
            subtotal += item.valorSubTotal
        }
        return parseFloat(subtotal.toString().replace('.',','))
    }
}
export { VendaRepository }