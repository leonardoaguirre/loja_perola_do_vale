import { EntityRepository, Repository } from "typeorm";
import { Imagem } from "../models/Imagem";

@EntityRepository(Imagem)
class ImagemRepository extends Repository<Imagem>{

    async verifica(img: Imagem) {
        return await this.find({ filename : img.filename })
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
export {ImagemRepository};