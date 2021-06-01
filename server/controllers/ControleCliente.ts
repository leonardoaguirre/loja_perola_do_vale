import { NextFunction, Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { ControlePessoa } from './ControlePessoa';
import { ControlePessoaFisica } from './ControlePessoaFisica';
import { ClienteRepository } from '../repositorios/ClienteRepository';
import { ControleTelefone } from './ControleTelefone';
import { AppError } from '../errors/AppError';
import { Encrypt } from '../services/encrypt';
import jwt from 'jsonwebtoken';

class ControleCliente {
    async adicionar(request: Request, response: Response) {
        const clienteRepository = getCustomRepository(ClienteRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaFisica = new ControlePessoaFisica();
        const controleTelefone = new ControleTelefone();

        try {
            await getManager().transaction(async transactionalEntityManager => {

                const pessoa = await controlePessoa.adicionarPessoa(request, response, transactionalEntityManager);
                // if (!(pessoa instanceof (Pessoa))) {
                //     await transactionalEntityManager.queryRunner.rollbackTransaction();
                //     // throw pessoa;
                //     erros.push(pessoa);
                // }

                const pessoaFisica = await controlePessoaFisica.adicionar(request, response, pessoa, transactionalEntityManager);

                await controleTelefone.adicionar(request, response, pessoa, transactionalEntityManager);

                const cliente = clienteRepository.create({ pessoaFisica })
                await transactionalEntityManager.save(cliente);

            });

            return response.status(200).json();

        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listar(request: Request, response: Response) {
        const clienteRepository = getCustomRepository(ClienteRepository);

        await clienteRepository.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhum cliente encontrado', 'cliente'));
                }
            })
    }
    async alterar(request: Request, response: Response) {
        const clienteRepository = getCustomRepository(ClienteRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaFisica = new ControlePessoaFisica();
        const id = request.params.idCliente;

        try {
            const clienteExiste = await clienteRepository.findOne(id);
            if (!clienteExiste) {
                throw new AppError('Cliente a ser alterado nao foi encontrado', 'cliente');
            }
            await getManager().transaction(async transactionalEntityManager => {
                //await controlePessoa.alterar(request, response, clienteExiste, transactionalEntityManager);
                await controlePessoaFisica.alterar(request, response, clienteExiste, transactionalEntityManager);
            });
            return response.status(200).json({ message: "Usuario alterado com sucesso" });
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const clienteRepository = getCustomRepository(ClienteRepository);
        const { id } = request.body;

        try {
            const existe = await clienteRepository.findOne({ id: id });
            if (existe) {
                // await clienteRepository.delete({ pessoaFisica: { pessoa: { id: existe.pessoaFisica.pessoa.id } } });
                const controlePessoa =  new ControlePessoa();
                controlePessoa.deletar(existe.pessoaFisica.pessoa.id);
                
                return response.status(200).json({ message: 'O cliente foi deletado com sucesso' });
            } else {
                throw new AppError('Cliente a ser deletado nao foi encontrado', 'cliente');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscar(request: Request, response: Response) {
        const atributo = request.params.atributo;
        const pesquisa = request.params.pesquisa;

        const clienteRepository = getCustomRepository(ClienteRepository);

        try {
            const clienteExiste = await clienteRepository.buscaPor(pesquisa, atributo);

            if (clienteExiste.length > 0) {
                return response.status(201).json(clienteExiste);
            } else {
                throw new AppError("Nenhum cliente encontrado", 'pesquisa');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarPorId(request: Request, response: Response) {
        const id = request.params.idCliente;
        const clienteRepository = getCustomRepository(ClienteRepository);

        try {
            const cliente = await clienteRepository.buscaPorId(id);
            if (!cliente) {
                throw new AppError('Cliente nao encontrado', 'cliente');
            }

            return response.status(200).json(cliente);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async login(request: Request, response: Response, next: NextFunction) {
        const clienteRepository = getCustomRepository(ClienteRepository);
        const { email, senha } = request.body;
        const encrypt = new Encrypt();
        console.log(email, senha);

        try {
            const clienteExiste = await clienteRepository.existeEmail(email);

            if (clienteExiste) {
                const res = await encrypt.validate(senha, clienteExiste.pessoaFisica.pessoa.senha);
                if (res == true) {
                    const token = jwt.sign({ id: clienteExiste.id }, process.env.SECRET_KEY, { expiresIn: '7d' });

                    return response.status(200).json({ message: "Usuario logado com sucesso!", token, pessoa: { id: clienteExiste.id, nome: clienteExiste.pessoaFisica.nome, email: clienteExiste.pessoaFisica.pessoa.email } });
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
    async buscarCliente(id: string) {
        const clienteRepository = getCustomRepository(ClienteRepository);

        try {
            const cliente = await clienteRepository.buscaPorId(id);
            if (!cliente) {
                throw new AppError('Cliente nao encontrado', 'cliente');
            }

            return cliente;
        } catch (error) {
            throw error;
        }
    }
}
export { ControleCliente };