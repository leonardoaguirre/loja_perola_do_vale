import { EntityRepository, Repository,ILike } from "typeorm";
import { PessoaFisica } from "../models/PessoaFisica";
import { validate } from "class-validator";
import { AppError } from "../errors/AppError";

@EntityRepository(PessoaFisica)
class PessoaFisicaRepository extends Repository<PessoaFisica>{
    async verifica(pessoaFisica : PessoaFisica){
        const validacoes = new Array<AppError>();

        if (await this.existeCpf(pessoaFisica.cpf)) {
            validacoes.push(new AppError("Este cpf ja foi registrado!", "cpf"));
        }
        if (await this.existeRg(pessoaFisica.rg)) {
            validacoes.push(new AppError("Este rg ja foi registrado!", "rg"));
        }
        return validacoes;
    }
    async validaDados(pessoaFisica : PessoaFisica){
        return await validate(pessoaFisica);
    }
    async existeCpf(cpf: string) {
        return this.findOne({ where: { cpf: cpf } });
    }
    async existeRg(rg: string) {
        return this.findOne({ where: { rg: rg } });
    }
}
export{PessoaFisicaRepository};