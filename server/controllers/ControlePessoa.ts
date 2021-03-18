import { Request, Response } from "express";
import { getConnection, getCustomRepository, getManager, Repository, RepositoryNotTreeError, TransactionManager } from "typeorm";
import { PessoaRepository } from "../repositorios/PessoaRepository";
import { AppError } from "../errors/AppError";
import { ControleTelefone } from "../controllers/ControleTelefone";
import { Pessoa } from "../models/Pessoa";

class ControlePessoa {

    async adicionar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { nome, rg, cpf, dtNasc, email } = request.body;

        const pessoa = pessoaRepository.create({
            nome,
            rg,
            cpf,
            dtNasc,
            email,
        });

        let retornoPessoa;

        try {
            await pessoaRepository.verifica(pessoa);
            const erros = await pessoaRepository.validaDados(pessoa);

            if (erros.length > 0) {
                throw erros;
            } else {
                const controleTelefone = new ControleTelefone();

                retornoPessoa = await pessoaRepository.save(pessoa);
                const retornoTelefone = await controleTelefone.adicionar(request, response, retornoPessoa);

                if (retornoTelefone) {
                    throw retornoTelefone;
                } else {
                    return response.status(201).json(request.body);
                }
                
            }
        } catch (error) {

            if(retornoPessoa instanceof Pessoa){
                await pessoaRepository.delete(retornoPessoa.id);
            } 
            
            return response.status(400).json(error);
        }
    }

    async listar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const all = await pessoaRepository.find();

        return response.status(200).json(all);
    }

    async buscarPorId(request: Request, response: Response) {
        const id = request.params.idPessoa;
        const pessoaRepository = getCustomRepository(PessoaRepository);

        const pessoaExiste = await pessoaRepository.findOne(id);

        if (pessoaExiste) {
            return response.status(201).json(pessoaExiste);
        } else {
            throw new AppError("O usuario nao foi encontrado");
        }
    }

    async alterar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { nome, rg, cpf, dtNasc, email } = request.body;
        const id = request.params.idPessoa;

        const pessoaExiste = await pessoaRepository.findOne(id);
        if (pessoaExiste) {

            const pessoa = pessoaRepository.create({
                nome,
                rg,
                cpf,
                dtNasc,
                email,
            });

            const erros = await pessoaRepository.validaDados(pessoa);

            if (erros.length > 0) {
                return response.status(400).json(erros);
            } else {
                await pessoaRepository.update(id, pessoa)
                    .then(async (retornoPessoa) => {
                        return response.status(201).json(retornoPessoa);
                    })
                    .catch(async (errors) => {
                        return response.status(400).json(errors);
                    });
            }
        } else {
            throw new AppError("O usuario de id: " + id + " a ser alterado nao foi encontrado ");
        }


    }


    async deletar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { id } = request.body;

        if (await pessoaRepository.findOne(id)) {
            await pessoaRepository.delete(id);
            return response.status(200).json({message : "O usuario de id "+id+" foi deletado com sucessso!"});
        } else {
            throw new AppError("O usuario a ser deletado nao foi encontrado");
        }
    }
}

export { ControlePessoa };
