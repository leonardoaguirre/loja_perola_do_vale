import { validate } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { Produto } from "../models/Produto";

@EntityRepository(Produto)
class ProdutoRepository extends Repository<Produto>{
    async validaDados(produto: Produto) {
        return await validate(produto);
    }
    async buscaPorId(busca: string) {
        return await this.findOne({ id: busca });
    }
    async verifica(produto: Produto) {
        return await this.findOne({where:{codBarra : produto.codBarra}})
        .then(res =>{
            return res;
        });
        // return this.createQueryBuilder("produto")
        // .where("produto.codBarra = :codBarra", { codBarra: produto.codBarra })
        // .getMany();
    }
}
export { ProdutoRepository };