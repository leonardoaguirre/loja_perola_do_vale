import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Fornecedor } from "../models/Fornecedor";

@EntityRepository(Fornecedor)
class FornecedorRepository extends Repository<Fornecedor>{
    buscaPor(pesquisa: string, atributo: string, skip : number, take : number) {
        if (atributo === "nome") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.nomeFantasia like :nome", { nome: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();
        } else if (atributo === "email") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoa.email like :email", { email: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();
        } else if (atributo === "cnpj") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.cnpj like :cnpj", { cnpj: `%${pesquisa}%` })
                .skip(skip)
                .take(take)
                .getManyAndCount();
        }
    }
    async validaDados(fornecedor: Fornecedor) {
        return await validate(fornecedor);
    }
    async verifica(fornecedor: Fornecedor) {

    }
    async buscaPorId(busca: string) {
        return await this.findOne({
            where: {
                id: busca
            }
        });
    }
    async buscarNomes() {
        return this.createQueryBuilder("fornecedor")
        .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
            .select(['fornecedor.id','pessoaJuridica.nomeFantasia'])
            .getMany();
    }
}
export { FornecedorRepository };