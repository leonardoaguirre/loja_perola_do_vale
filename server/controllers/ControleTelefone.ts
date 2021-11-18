import { AppError } from "../errors/AppError";
import { Request, Response } from "express";
import { EntityManager, getCustomRepository } from "typeorm";
import { TelefoneRepository } from "../repositorios/TelefoneRepository"
import { Pessoa } from "../models/Pessoa";
import { validar } from '../services/validaDados'

class ControleTelefone {
    async adicionar(request: Request, response: Response, pessoa: Pessoa, manager: EntityManager) {
        const telefones = request.body.telefones;
        const idPessoa = request.body
        const telefoneRepository = getCustomRepository(TelefoneRepository);
        const id_pessoa_fk = pessoa.id || idPessoa;

        const tel = telefoneRepository.create({
            ddd: telefones[0].ddd,
            numero: telefones[0].numero,
            id_pessoa_fk
        });

        try {
            await validar(tel)
            const telefone = await manager.save(tel);
            return telefone;
        } catch (error) {
            throw error;
        }
    }

    async adicionarTelefone(request: Request, response: Response) {
        const { numero, ddd, idPessoa } = request.body
        const telefoneRepository = getCustomRepository(TelefoneRepository);

        const tel = telefoneRepository.create({
            ddd,
            numero,
            id_pessoa_fk: idPessoa
        });

        try {
            await validar(tel)
            await telefoneRepository.save(tel)
            return response.status(201).json('Telefone adicionado com sucesso!')
        } catch (error) {
            return response.status(400).json(error);
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
        const { ddd, numero, id, idPessoa } = request.body;
        
        try {
            const telefoneExiste = await telefoneRepository.findOne({ relations : ['pessoa'], where: { id: id, pessoa: { id: idPessoa } } })
            if (telefoneExiste) {

                const telefone = telefoneRepository.create({
                    id: telefoneExiste.id,
                    ddd,
                    numero,
                    id_pessoa_fk: telefoneExiste.id_pessoa_fk
                });

                await validar(telefone)

                await telefoneRepository.save(telefone)
                    .then(async (result) => {
                        return response.status(201).json(result);
                    })
                    .catch(async (errors) => {
                        return response.status(400).json(errors);
                    });

            } else {
                throw new AppError("Telefone ou usuario nao encontrado ", 'telefone');
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