import { AppError } from "../errors/AppError";
import { Request, Response } from "express";
import { EntityManager, getCustomRepository } from "typeorm";
import { TelefoneRepository } from "../repositorios/TelefoneRepository"
import { Pessoa } from "../models/Pessoa";


class ControleTelefone {
    async adicionar(request: Request, response: Response, pessoa: Pessoa , manager : EntityManager) {
        const telefones = request.body.telefones;
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const id_pessoa_fk = pessoa.id;

        const tel = telefoneRepository.create({
            ddd: telefones[0].ddd,
            numero: telefones[0].numero,
            id_pessoa_fk
        });

        try {
            const erros = await telefoneRepository.validaDados(tel);
            if (erros.length > 0) {
                throw erros;
            } else {
                const telefone = await manager.save(tel);
                return telefone;
            }

        } catch (error) {
            throw error;
        }

    }

    async listar(request: Request, response: Response) {
        const telefoneRepository = getCustomRepository(TelefoneRepository);

        await telefoneRepository.find().then((all) => {
            return response.json(all);
        });

    }
    async listarPorId(request: Request, response: Response) {
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const id = request.params.id;

        try {
            telefoneRepository.listaPorId(id).then((result) => {
                if (result.length > 0) {
                    return response.status(201).json(result);
                } else {
                    throw new AppError("Nenhum telefone resgistrado", "telefone");
                }
            });
        } catch (error) {
            return response.status(400).json(error);
        }


    }
    async alterar(request: Request, response: Response) {
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const { ddd, numero } = request.body;
        const id = request.params.idPessoa;

        try {
            const pessoaExiste = await telefoneRepository.findOne(id);
            if (pessoaExiste) {

                const telefone = telefoneRepository.create({
                    ddd,
                    numero
                });

                const erros = await telefoneRepository.validaDados(telefone);

                if (erros.length > 0) {
                    return response.status(400).json(erros);
                } else {
                    await telefoneRepository.update(id, telefone)
                        .then(async (result) => {
                            return response.status(201).json(result);
                        })
                        .catch(async (errors) => {
                            return response.status(400).json(errors);
                        });
                }
            } else {
                throw new AppError("O usuario de id: " + id + " a ser alterado nao foi encontrado ", 'id');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const { id } = request.body;

        try {
            if (await telefoneRepository.findOne(id)) {
                await telefoneRepository.delete(id);
                return response.status(200).json({ message: "O telefone de id " + id + " foi deletado com sucessso!" });
            } else {
                throw new AppError("O Telefone a ser deletado nao foi encontrado", 'telefone');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
}
export { ControleTelefone };