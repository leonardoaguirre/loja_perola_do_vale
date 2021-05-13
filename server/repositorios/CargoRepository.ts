import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Cargo } from "../models/Cargo";

@EntityRepository(Cargo)
class CargoRepository extends Repository<Cargo>{
    async validaDados(cargo: Cargo) {
        return await validate(cargo);
    }
    async verifica(cargo: Cargo) {
        return await this.find({ descricao: cargo.descricao })
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
export { CargoRepository };