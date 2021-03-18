import { EntityRepository, Repository } from "typeorm";
import { Pessoa } from "../models/Pessoa";
import { validate } from "class-validator";
import { AppError } from "../errors/AppError";

@EntityRepository(Pessoa)
class PessoaRepository extends Repository<Pessoa> {
    async verifica(pessoa: Pessoa) {

        if (await this.existeEmail(pessoa.email)) {
            throw new AppError("Este email ja foi registrado!");
        }
        // erros.push("Este email ja foi registrado!");
        if (await this.existeCpf(pessoa.cpf)) {
            throw new AppError("Este cpf ja foi registrado!");
        }
        // erros.push("Este cpf ja foi registrado!");
        if (await this.existeRg(pessoa.rg)) {
            throw new AppError("Este rg ja foi registrado!");
        }

    }
    async validaDados(pessoa: Pessoa) {
        return await validate(pessoa);
    }
    async existeEmail(email: string) {
        return this.findOne({ where: { email: email } });
    }
    async existeCpf(cpf: string) {
        return this.findOne({ where: { cpf: cpf } });
    }
    async existeRg(rg: string) {
        return this.findOne({ where: { rg: rg } });
    }
}

export { PessoaRepository };