import { validate } from "class-validator";
import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Fornecedor } from "../models/Fornecedor";

@EntityRepository(Fornecedor)
class FornecedorRepository extends Repository<Fornecedor>{
    buscaPor(pesquisa: string, atributo: string) {
        if (atributo === "nome") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.nomeFantasia like :nome", { nome: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "email") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoa.email like :email", { email: `%${pesquisa}%` })
                .getMany();
        } else if (atributo === "cnpj") {
            return this.createQueryBuilder("fornecedor")
                .leftJoinAndSelect("fornecedor.pessoaJuridica", "pessoaJuridica")
                .leftJoinAndSelect("pessoaJuridica.pessoa", "pessoa")
                .where("pessoaJuridica.cnpj like :cnpj", { cnpj: `%${pesquisa}%` })
                .getMany();
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

}
export { FornecedorRepository };