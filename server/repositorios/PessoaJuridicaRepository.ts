import { PessoaJuridica } from '../models/PessoaJuridica';
import { Entity, EntityRepository, Repository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { validate } from 'class-validator';

@EntityRepository(PessoaJuridica)
class PessoaJuridicaRepository extends Repository<PessoaJuridica>{
    async verifica(pessoaJuridica: PessoaJuridica) {
        const validacoes = new Array<AppError>();

        if (await this.findOne({ where: { cnpj: pessoaJuridica.cnpj } })) {
            validacoes.push(new AppError("Este cnpj ja foi registrado!", "cnpj"));
        }
        return validacoes;
    }
    async validaDados(pessoaJuridica: PessoaJuridica){
        return await validate(pessoaJuridica);
    }
}
export { PessoaJuridicaRepository };