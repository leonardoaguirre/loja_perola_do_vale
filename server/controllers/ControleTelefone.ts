import { AppError } from "../errors/AppError";
import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { TelefoneRepository } from "../repositorios/TelefoneRepository"
import { Pessoa } from "../models/Pessoa";


class ControleTelefone {
    async adicionar(request: Request, response: Response, pessoa) {
        const telefones = request.body.telefones;
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const id_pessoa_fk = pessoa.id;

        for (let index = 0; index < telefones.length; index++) {
            const element = telefones[index];

            const numero = element.numero;
            const ddd = element.ddd;


            const tel = await telefoneRepository.create({
                ddd,
                numero,
                id_pessoa_fk
            });

            const erros = await telefoneRepository.validaDados(tel);
            if (erros.length > 0) {
                return erros;
            } else {
                await telefoneRepository.save(tel);
            }

        }
        return;
        // telefones.forEach( async element => {
        //     // const inseridos = await telefoneRepository.find()
        //     // await telefoneRepository.remove(pessoa.id);

        //     //     .then(async (erro) => {
        //     //         .then(async (inseridos) => {
        //     //                 .then(() => console.log("removeu telefones", (inseridos.length)))
        //     // })
        //     //     throw erro;
        //     // })
        //     //     .catch(async () => {

        //     //         console.log("adicionou um telefone")
        //     //     });
        // });
        //return null;
    }

    async listar(request: Request, response: Response) {
        const telefoneRepository = getCustomRepository(TelefoneRepository);

        await telefoneRepository.find().then((all) => {
            return response.json(all);
        });

    }
    async buscarPorId(request: Request, response: Response) {

    }
    async alterar(request: Request, response: Response) {

    }
    async deletar(request: Request, response: Response) {

    }
}
export { ControleTelefone };