import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { Categoria } from "../models/Categoria";

@EntityRepository(Categoria)
class CategoriaRepository extends Repository<Categoria>{
    async validaDados(categoria: Categoria) {
        return await validate(categoria);
    }
    async verifica(categoria: Categoria) {
        return await this.find({ descricao: categoria.descricao })
            .then(result => {
                return result;
            })
    }
    async buscaPorId(busca: string) {
        return this.findOne({id : busca});
    }

}
export { CategoriaRepository };