import { NextFunction, Request, Response } from "express";
import { EntityManager, getCustomRepository } from "typeorm";
import { PessoaRepository } from "../repositorios/PessoaRepository";
import { AppError } from "../errors/AppError";
import { Encrypt } from "../services/encrypt";
import jwt from 'jsonwebtoken';
import { Pessoa } from "../models/Pessoa";
import { Cliente } from "../models/Cliente";

class ControlePessoa {
    async adicionarPessoa(request: Request, response: Response, entityManager: EntityManager) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { email, senha } = request.body;

        const encrypt = new Encrypt();
        const senhaCrypt = await encrypt.execute(senha);

        const pessoa = pessoaRepository.create({
            email,
            senha: senhaCrypt,
        });

        try {
            const result = await pessoaRepository.verifica(pessoa)
            if (result.length > 0) {
                throw result;
            }
            const erros = await pessoaRepository.validaDados(pessoa);
            if (erros.length > 0) {
                throw erros;
            }
            const retornoPessoa = await entityManager.save(pessoa);

            return retornoPessoa;

        } catch (error) {
            throw error;
        }
    }

    // async listar(request: Request, response: Response, next: NextFunction) {
    //     const pessoaRepository = getCustomRepository(PessoaRepository);
    //     const all = await pessoaRepository.find();

    //     return response.status(200).json(all);
    // }

    // async buscar(request: Request, response: Response) {
    //     const atributo = request.params.atributo;
    //     const pesquisa = request.params.pesquisa;

    //     const pessoaRepository = getCustomRepository(PessoaRepository);

    //     try {
    //         const pessoaExiste = await pessoaRepository.buscaPor(pesquisa, atributo);

    //         if (pessoaExiste.length > 0) {
    //             return response.status(201).json(pessoaExiste);
    //         } else {
    //             throw new AppError("O usuario nao foi encontrado", 'atributo');
    //         }
    //     } catch (error) {
    //         return response.status(400).json(error);
    //     }

    // }

    async alterar(request: Request, response: Response, pessoa, manager: EntityManager) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { email, senha } = request.body;
        const id = pessoa.pessoaFisica.pessoa.id;

        try {
            const pessoaExiste = await pessoaRepository.findOne(id);
            if (pessoaExiste) {
                const encrypt = new Encrypt();
                const senhaCrypt = await encrypt.execute(senha);

                const pessoa = pessoaRepository.create({
                    id,
                    email,
                    senha : senhaCrypt
                });

                const erros = await pessoaRepository.validaDados(pessoa);
                if (erros.length > 0) {
                    throw erros;
                } else {
                    await manager.update(Pessoa, id, pessoa)
                        .then(() => {
                            return pessoa;
                        })
                        .catch((errors) => {
                            throw errors;
                        });
                }
            } else {
                throw new AppError("O usuario de a ser alterado nao foi encontrado ", 'id');
            }
        } catch (error) {
            throw error;
        }
    }
    async deletar(id : string) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        try {
            if (await pessoaRepository.findOne(id)) {
                await pessoaRepository.delete(id).then(result=>{
                    if(!result.affected){
                        throw new AppError("Usuario nao deletado", 'usuario');
                    }
                    return result;
                });
            } else {
                throw new AppError("O usuario a ser deletado nao foi encontrado", 'id');
            }
        } catch (error) {
            throw error;
        }

    }
    async login(request: Request, response: Response, next: NextFunction) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { email, senha } = request.body;
        const encrypt = new Encrypt();

        try {
            const pessoaExiste = await pessoaRepository.existeEmail(email);

            if (pessoaExiste) {
                const res = await encrypt.validate(senha, pessoaExiste.senha)
                if (res == true) {
                    const token = jwt.sign({ id: pessoaExiste.id }, process.env.SECRET_KEY, { expiresIn: '7d' });

                    return response.status(200).json({ message: "Usuario logado com sucesso!", token, pessoa: { id: pessoaExiste.id,/*nome : pessoaExiste.nome,*/ email: pessoaExiste.email } });
                } else {
                    throw new AppError("Email ou senha inválidos", "login");
                }
            } else {
                throw new AppError("Email ou senha inválidos", "login");
            }
        } catch (error) {
            return response.status(401).json(error);
        }
    }
    async buscaPessoa(id: string) {
        const pessoaRepository = getCustomRepository(PessoaRepository);

        try {
            const pessoa = await pessoaRepository.findOne(id);
            if (!pessoa) {
                throw new AppError('Nenhuma pessoa encontrada', 'pessoa');
            }
            return pessoa;

        } catch (error) {
            throw error;
        }
    }
}

export { ControlePessoa };
