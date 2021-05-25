import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Favorito } from "../models/Favorito";

@EntityRepository(Favorito)
class FavoritoRepository extends Repository<Favorito>{
    async validaDados(Favorito: Favorito) {
        return await validate(Favorito);
    }
    async verifica(favorito: Favorito) {
        return await this.find(favorito)
            .then(result => {
                return result;
            })
    }
    async buscaPorId(busca: string) {
        return await this.findOne({
            where: {
                id: busca
            }
        });
    }

}
export { FavoritoRepository };