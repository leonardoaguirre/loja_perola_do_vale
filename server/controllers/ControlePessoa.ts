import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { PessoaRepository } from "../repositorios/PessoaRepository";
import { AppError } from "../errors/AppError";
import { ControleTelefone } from "../controllers/ControleTelefone";
import { Pessoa } from "../models/Pessoa";
<<<<<<< HEAD
import { Encrypt } from "../services/encrypt";
import jwt from 'jsonwebtoken';
=======
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

class ControlePessoa {

    async adicionar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
<<<<<<< HEAD
        const { nome, rg, cpf, dtNasc, email, senha } = request.body;
        const encrypt = new Encrypt();
        const senhaCrypt = await encrypt.execute(senha);
=======
        const { nome, rg, cpf, dtNasc, email } = request.body;
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

        const pessoa = pessoaRepository.create({
            nome,
            rg,
            cpf,
            dtNasc,
            email,
<<<<<<< HEAD
            senha : senhaCrypt,
=======
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
        });

        let retornoPessoa;

        try {
            await pessoaRepository.verifica(pessoa)
                .then(async (result) => {
<<<<<<< HEAD
                    if (result.length > 0) {
=======
                    if (result) {
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
                        throw result;
                    }
                    const erros = await pessoaRepository.validaDados(pessoa);

                    if (erros.length > 0) {
                        throw erros;
                    }
                    else {
                        const controleTelefone = new ControleTelefone();

                        retornoPessoa = await pessoaRepository.save(pessoa);
                        const retornoTelefone = await controleTelefone.adicionar(request, response, retornoPessoa);

                        if (retornoTelefone.length > 0) {
                            throw retornoTelefone;
                        } else {
                            return response.status(201).json(retornoPessoa.id);
                        }
<<<<<<< HEAD
=======

>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
                    }
                }).catch((res) => {
                    throw res;
                });

        } catch (error) {

            if (retornoPessoa instanceof Pessoa) {
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

<<<<<<< HEAD
        try {
            const pessoaExiste = await pessoaRepository.findOne(id);

            if (pessoaExiste) {
                return response.status(201).json(pessoaExiste);
            } else {
                throw new AppError("O usuario nao foi encontrado", 'id');
            }
        } catch (error) {
            return response.status(400).json(error);
        }

=======
        const pessoaExiste = await pessoaRepository.findOne(id);

        if (pessoaExiste) {
            return response.status(201).json(pessoaExiste);
        } else {
            throw new AppError("O usuario nao foi encontrado", 'id');
        }
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
    }

    async alterar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { nome, rg, cpf, dtNasc, email } = request.body;
        const id = request.params.idPessoa;

<<<<<<< HEAD
        try {
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
                throw new AppError("O usuario de id: " + id + " a ser alterado nao foi encontrado ", 'id');
            }
        } catch (error) {
            return response.status(400).json(error);
        }



    }
    async deletar(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { id } = request.body;

        try {
            if (await pessoaRepository.findOne(id)) {
                await pessoaRepository.delete(id);
                return response.status(200).json({ message: "O usuario de id " + id + " foi deletado com sucessso!" });
            } else {
                throw new AppError("O usuario a ser deletado nao foi encontrado", 'id');
            }
        } catch (error) {
            return response.status(200).json(error);
        }

    }
    async login(request: Request, response: Response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { login, senha } = request.body;
        const encrypt = new Encrypt();

        try {
            const pessoa = await pessoaRepository.existeEmail(login);

            if (pessoa) {
                const res = await encrypt.validate(senha, pessoa.senha)
                if (res == true) {
                    const token = jwt.sign({id : pessoa.id},process.env.SECRET_KEY,{expiresIn : '7d'});
                    delete pessoa.senha;

                    return response.status(200).json({ message: "Usuario logado com sucesso!",token,pessoa});
                } else {
                    throw new AppError("Email ou senha inválidos", "login");
                }
            } else {
                throw new AppError("Email ou senha inválidos", "login");
            }
        } catch (error) {
            return response.status(401).json(error);
        }


=======
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
            throw new AppError("O usuario de id: " + id + " a ser alterado nao foi encontrado ", 'id');
        }


    }


    async deletar(request, response) {
        const pessoaRepository = getCustomRepository(PessoaRepository);
        const { id } = request.body;

        if (await pessoaRepository.findOne(id)) {
            await pessoaRepository.delete(id);
            return response.status(200).json({ message: "O usuario de id " + id + " foi deletado com sucessso!" });
        } else {
            throw new AppError("O usuario a ser deletado nao foi encontrado", 'id');
        }
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
    }
}

export { ControlePessoa };
