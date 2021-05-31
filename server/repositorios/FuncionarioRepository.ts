import { validate } from "class-validator";
import { EntityRepository, ILike, Like, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Funcionario } from "../models/Funcionario";

@EntityRepository(Funcionario)
class FuncionarioRepository extends Repository<Funcionario>{
    async existeEmail(email: string) {
        return this.createQueryBuilder("funcionario")
            .leftJoinAndSelect("funcionario.pessoaFisica", "pessoaFisica")
            .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
            .where("pessoa.email = :email", { email: email })
            .getOne();
    }
    buscaPor(pesquisa: string, atributo: string) {
        if (atributo === "nome") {
            return this.createQueryBuilder("funcionario")
                .leftJoinAndSelect("funcionario.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoaFisica.nome like :nome", { nome: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "email") {
            return this.createQueryBuilder("funcionario")
                .leftJoinAndSelect("funcionario.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoa.email like :email", { email: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "cpf") {
            return this.createQueryBuilder("funcionario")
                .leftJoinAndSelect("funcionario.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoaFisica.cpf like :cpf", { cpf: `%${pesquisa}%` })
                .getMany();
        }
    }
    async validaDados(Funcionario: Funcionario) {
        return await validate(Funcionario);
    }
    async verifica(Funcionario: Funcionario) {

    }
    async buscaPorId(busca: string) {
        return await this.find({
            where: {
                id: busca
            }
        });
    }
    async buscaGerente(id: string) {
        // return await this.findOne({ where: { cargo: { descricao: ILike('gerente'), id: id } }})
        return this.createQueryBuilder("funcionario")
        .leftJoinAndSelect("funcionario.pessoaFisica", "pessoaFisica")
        .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
        .leftJoinAndSelect("funcionario.cargo", "cargo")
        .where("cargo.descricao like :desc", { desc: 'gerente' })
        .andWhere("funcionario.id = :idFunc", {idFunc : id})
        .getOne();
    }

}
export { FuncionarioRepository };