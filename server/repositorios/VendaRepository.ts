import { validate } from "class-validator";
import moment from "moment";
import { EntityRepository, getCustomRepository, Like, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Produto } from "../models/Produto";
import { ItemVenda, Status, Venda } from "../models/Venda";
import { ProdutoRepository } from "./ProdutoRepository";

@EntityRepository(Venda)
class VendaRepository extends Repository<Venda>{
    async validaDados(venda: Venda) {
        return await validate(venda)
    }
    async buscaPorId(id: string, pag: number, itensPorPag: number) {
        return await this.findAndCount({
            where: { pessoa: { id: id } },
            order: { dtCompra: 'DESC' },
            skip: (pag - 1) * itensPorPag,
            take: itensPorPag
        })
    }
    async pesquisar(pesquisa: string, atributo: string) {
        if (atributo === "id") {
            return this.find({ where: { id: parseInt(pesquisa) } })
        }
        else if (atributo === "dtCompra") {
            return this.createQueryBuilder("venda")
                .leftJoinAndSelect("venda.pessoa", "pessoa")
                .leftJoinAndSelect("venda.itensVenda", "itemvenda")
                .leftJoinAndSelect("venda.destino", "endereco")
                .leftJoinAndSelect("itemvenda.produto", "produto")
                .leftJoinAndSelect("produto.imagens", "imagem")
                .where("DATE(dtCompra) = :dt", { dt: `${moment(pesquisa.replace('/','-'),`DD-MM-YYYY`).format(`YYYY-MM-DD`)}` })
                .getMany();
        }
        else if (atributo === "email") {
            return this.createQueryBuilder("venda")
                .leftJoinAndSelect("venda.pessoa", "pessoa")
                .leftJoinAndSelect("venda.itensVenda", "itemvenda")
                .leftJoinAndSelect("venda.destino", "endereco")
                .leftJoinAndSelect("itemvenda.produto", "produto")
                .leftJoinAndSelect("produto.imagens", "imagem")
                .where("pessoa.email=:email", { email: `${pesquisa}` })
                .getMany();
        }
        else {
            throw new AppError('Filtro invalido', 'filtro')
        }
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

        return parseFloat(subtotal.toFixed(2))
    }

    async listarVendasPrioritarias(pag: number, itensPorPag: number) {
        return this.findAndCount({
            relations: ['destino'],
            order: { dtCompra: 'ASC' },
            where: { status: Status.COMPRA_APROVADA },
            skip: (pag - 1) * itensPorPag,
            take: itensPorPag
        })
    }
}
export { VendaRepository }