import { EntityRepository, Repository,ILike } from "typeorm";
import { Pessoa } from "../models/Pessoa";
import { validate } from "class-validator";
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
        // if (await this.existeCpf(pessoa.cpf)) {
        //     validacoes.push(new AppError("Este cpf ja foi registrado!", "cpf"));
        // }
        // if (await this.existeRg(pessoa.rg)) {
        //     validacoes.push(new AppError("Este rg ja foi registrado!", "rg"));
        // }

        return validacoes;
    }
    async validaDados(pessoa: Pessoa) {
        return await validate(pessoa);
    }
    async existeEmail(email: string) {
        return this.findOne({ where: { email: email } });
    }

    async buscaPor(pesquisa : string ,atributo : string){
        console.log(pesquisa, atributo);
        
        /*if(atributo === "nome"){
            return await this.find({nome : ILike('%'+pesquisa+'%')});
        }*/
        if(atributo === "email"){
            return await this.find({email : ILike(pesquisa+'%')});
        }
        //else if(atributo ==="cpf"){
        //     return await this.find({cpf : ILike(pesquisa)});
        // }
    }
}

export { PessoaRepository };