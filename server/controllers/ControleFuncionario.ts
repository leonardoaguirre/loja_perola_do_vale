import { Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { AppError } from '../errors/AppError';
import jwt from 'jsonwebtoken';
import { FuncionarioRepository } from '../repositorios/FuncionarioRepository';
import { Encrypt } from '../services/encrypt';
import { ControleCargo } from './ControleCargo';
import { ControlePessoa } from './ControlePessoa';
import { ControlePessoaFisica } from './ControlePessoaFisica';
import { ControleTelefone } from './ControleTelefone';

class ControleFuncionario {
    async adicionar(request: Request, response: Response) {
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaFisica = new ControlePessoaFisica();
        const controleTelefone = new ControleTelefone();
        const controleCargo = new ControleCargo();
        const { salario, idCargo } = request.body;

        try {
            await getManager().transaction(async manager => {
                const pessoa = await controlePessoa.adicionarPessoa(request, response, manager);

                const pessoaFisica = await controlePessoaFisica.adicionar(request, response, pessoa, manager);

                await controleTelefone.adicionar(request, response, pessoa, manager);

                const cargo = await controleCargo.buscaCargo(idCargo);

                const funcionario = funcionarioRepository.create({ pessoaFisica, salario, cargo });

                await manager.save(funcionario);
            })

            return response.status(200).json("Funcionario cadastrado com sucesso!");
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async alterar(request: Request, response: Response) {
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaFisica = new ControlePessoaFisica();
        const id = request.params.idFuncionario;

        try {
            const funcionarioExiste = await funcionarioRepository.findOne(id);
            if (!funcionarioExiste) {
                throw new AppError('Funcionario a ser alterado nao foi encontrado', 'funcionario');
            }
            await getManager().transaction(async manager => {
                await controlePessoa.alterar(request, response, funcionarioExiste, manager);
                await controlePessoaFisica.alterar(request, response, funcionarioExiste, manager);
            });

            return response.status(200).json({ message: "Usuario alterado com sucesso" });
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);
        const { id } = request.body;

        try {
            const existe = await funcionarioRepository.findOne(id);
            if (existe) {
                await funcionarioRepository.delete(id);
                return response.status(200).json({ message: 'O funcionario foi deletado com sucesso' });
            } else {
                throw new AppError('Funcionario a ser deletado nao foi encontrado', 'cliente');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listar(request: Request, response: Response) {
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);

        await funcionarioRepository.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhum funcionario encontrado', 'cliente'));
                }
            })
    }
    async buscarPorId(request: Request, response: Response) {
        const id = request.body.idFuncionario;
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);

        try {
            const funcionario = await funcionarioRepository.buscaPorId(id);
            if (!funcionario) {
                throw new AppError('Funcionario nao encontrado', 'funcionario');
            }

            return response.status(200).json(funcionario);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarPor(request: Request, response: Response) {
        const atributo = request.params.atributo;
        const pesquisa = request.params.pesquisa;

        const funcionarioRepository = getCustomRepository(FuncionarioRepository);

        try {
            const funcionarioExiste = await funcionarioRepository.buscaPor(pesquisa, atributo);

            if (funcionarioExiste.length > 0) {
                return response.status(201).json(funcionarioExiste);
            } else {
                throw new AppError("Nenhum funcionario encontrado", 'funcionario');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarGerente(id : string){
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);

        try {
            const funcionario = await funcionarioRepository.buscaGerente(id);
            if (!funcionario) {
                throw new AppError('Gerente nao encontrado', 'gerente');
            }

            return funcionario;
        } catch (error) {
            throw error;
        }
    }
    async login(request: Request, response: Response) {
        const funcionarioRepository = getCustomRepository(FuncionarioRepository);
        const { email, senha } = request.body;
        const encrypt = new Encrypt();

        try {
            const funcExiste = await funcionarioRepository.existeEmail(email);

            if (funcExiste) {
                const res = await encrypt.validate(senha, funcExiste.pessoaFisica.pessoa.senha);
                if (res == true) {
                    const token = jwt.sign({ id: funcExiste.id }, process.env.SECRET_KEY, { expiresIn: '7d' });

                    return response.status(200).json({ message: "Usuario logado com sucesso!", token, pessoa: { id: funcExiste.id, nome : funcExiste.pessoaFisica.nome, email: funcExiste.pessoaFisica.pessoa.email } });
                } else {
                    throw new AppError("senha inválidos", "login");
                }
            } else {
                throw new AppError("Email ou senha inválidos", "login");
            }
        } catch (error) {
            return response.status(401).json(error);
        }
    }
}
export { ControleFuncionario };