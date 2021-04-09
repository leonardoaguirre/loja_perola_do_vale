import { Validate, validate, validateOrReject } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { Telefone } from "../models/Telefone";

@EntityRepository(Telefone)
class TelefoneRepository extends Repository<Telefone> {
    async validaDados(telefone: Telefone) {
        return await validate(telefone);
    }
}

export { TelefoneRepository };