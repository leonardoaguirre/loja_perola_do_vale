import { } from "class-validator";
import { EntityRepository, ILike, Repository } from "typeorm";
import { Cliente } from "../models/Cliente";

@EntityRepository(Cliente)
class ClienteRepository extends Repository<Cliente>{
    async buscaPor(pesquisa: string, atributo: string) {
        if (atributo === "nome") {
            return await this.find({pessoaFisica : {nome : ILike('%'+pesquisa+'%') }});
        } else if (atributo === "email") {
            return await this.find({ where: { pessoaFisica: { pessoa: { email: ILike(pesquisa + '%') } } } });
        } else if (atributo === "cpf") {
            return await this.find({ where: { pessoaFisica: { cpf: ILike+ pesquisa + '%'} } });
        }
    }

}
export { ClienteRepository };