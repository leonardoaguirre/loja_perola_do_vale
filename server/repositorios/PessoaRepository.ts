import { EntityRepository, Repository } from "typeorm";
import { Pessoa } from "../models/Pessoa";
import { validate, ValidationError } from "class-validator";
import { AppError } from "../errors/AppError";

@EntityRepository(Pessoa)
class PessoaRepository extends Repository<Pessoa> {
    async verifica(pessoa: Pessoa) {
        const validacoes = new Array<AppError>();

        await this.existeEmail(pessoa.email)
            .then((result) => {
                if (result) {
                    validacoes.push(new AppError("Este email ja foi registrado!", "email"));
                }
            })
        if (await this.existeCpf(pessoa.cpf)) {
            validacoes.push(new AppError("Este cpf ja foi registrado!", "cpf"));
        }
        if (await this.existeRg(pessoa.rg)) {
            validacoes.push(new AppError("Este rg ja foi registrado!", "rg"));
        }

        return validacoes;
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