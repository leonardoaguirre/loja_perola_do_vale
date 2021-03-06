import { } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { Cliente } from "../models/Cliente";

@EntityRepository(Cliente)
class ClienteRepository extends Repository<Cliente>{
    async existeEmail(email: string) {
        // return await this.findOne({ pessoaFisica: { pessoa: { email: email } } });
        return this.createQueryBuilder("cliente")
            .leftJoinAndSelect("cliente.pessoaFisica", "pessoaFisica")
            .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
            .where("pessoa.email = :email", { email: email })
            .getOne();
    }
    async buscaPor(pesquisa: string, atributo: string, skip: number, take: number) {
        if (atributo === "nome") {
            return this.createQueryBuilder("cliente")
                .leftJoinAndSelect("cliente.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoaFisica.nome like :nome", { nome: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();

        } else if (atributo === "email") {
            return this.createQueryBuilder("cliente")
                .leftJoinAndSelect("cliente.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoa.email like :email", { email: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();
        } else if (atributo === "cpf") {
            return this.createQueryBuilder("cliente")
                .leftJoinAndSelect("cliente.pessoaFisica", "pessoaFisica")
                .leftJoinAndSelect("pessoaFisica.pessoa", "pessoa")
                .where("pessoaFisica.cpf like :cpf", { cpf: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();
        }
    }
    async buscaPorId(id: string) {
        return this.findOne({ id: id });
    }

}
export { ClienteRepository };