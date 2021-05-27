import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { Empresa } from "../models/Empresa";

@EntityRepository(Empresa)
class EmpresaRepository extends Repository<Empresa>{
    buscaPor(pesquisa: string, atributo: string) {
        if (atributo === "nome") {
            return this.createQueryBuilder("empresa")
                .leftJoinAndSelect("empresa.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.nomeFantasia like :nome", { nome: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "email") {
            return this.createQueryBuilder("empresa")
                .leftJoinAndSelect("empresa.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoa.email like :email", { email: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "cnpj") {
            return this.createQueryBuilder("empresa")
                .leftJoinAndSelect("empresa.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.cnpj like :cnpj", { cnpj: `%${pesquisa}%` })
                .getMany();
        }
    }
    async validaDados(Empresa: Empresa) {
        return await validate(Empresa);
    }
    async verifica(Empresa: Empresa) {

    }
    async buscaPorId(busca: string) {
        return await this.findOne({
            where: {
                id: busca
            }
        });
    }

}
export { EmpresaRepository };