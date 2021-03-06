import { Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { AppError } from '../errors/AppError';
import { FornecedorRepository } from '../repositorios/FornecedorRepository';
import { ControlePessoa } from './ControlePessoa';
import { ControlePessoaJuridica } from './ControlePessoaJuridica';
import { ControleTelefone } from './ControleTelefone';
import { validar } from '../services/validaDados';

class ControleFornecedor {
    async adicionar(request: Request, response: Response) {
        const { representante } = request.body;
        const fornecedorRepository = getCustomRepository(FornecedorRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaJuridica = new ControlePessoaJuridica();
        const controleTelefone = new ControleTelefone();

        try {
            await getManager().transaction(async manager => {
                const pessoa = await controlePessoa.adicionarPessoa(request, response, manager);

                const pessoaJuridica = await controlePessoaJuridica.adicionar(request, response, pessoa, manager);

                await controleTelefone.adicionar(request, response, pessoa, manager);

                const fornecedor = fornecedorRepository.create({ pessoaJuridica, representante });
                await validar(fornecedor);

                await manager.save(fornecedor);
            })

            return response.status(200).json("Fornecedor cadastrado com sucesso!");
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async alterar(request: Request, response: Response) {
        const fornecedorRepository = getCustomRepository(FornecedorRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaJuridica = new ControlePessoaJuridica();
        const id = request.params.idFornecedor;

        try {
            const fornecedorExiste = await fornecedorRepository.buscaPorId(id);
            if (!fornecedorExiste) {
                throw new AppError('Fornecedor a ser alterado nao foi encontrado', 'fornecedor');
            }
            await getManager().transaction(async manager => {
                await controlePessoa.alterar(request, response, fornecedorExiste, manager);
                await controlePessoaJuridica.alterar(request, response, fornecedorExiste, manager);
            });

            return response.status(200).json({ message: "Fornecedor alterado com sucesso" });
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const fornecedorRepository = getCustomRepository(FornecedorRepository);
        const { id } = request.body;

        try {
            const existe = await fornecedorRepository.buscaPorId(id);
            if (existe) {
                await fornecedorRepository.delete(id);
                return response.status(200).json({ message: 'O Fornecedor foi deletado com sucesso' });
            } else {
                throw new AppError('Fornecedor a ser deletado nao foi encontrado', 'fornecedor');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listar(request: Request, response: Response) {
        const fornecedorRepository = getCustomRepository(FornecedorRepository);

        await fornecedorRepository.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhum fornecedor encontrado', 'fornecedor'));
                }
            })
    }
    async listarNomes(request: Request, response: Response) {
        const fornecedorRepository = getCustomRepository(FornecedorRepository);

        await fornecedorRepository.buscarNomes()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhum fornecedor encontrado', 'fornecedor'));
                }
            })
    }
    async buscarPorId(request: Request, response: Response) {
        const id = request.params.idFornecedor;
        const fornecedorRepository = getCustomRepository(FornecedorRepository);

        try {
            const fornecedor = await fornecedorRepository.buscaPorId(id);
            if (!fornecedor) {
                throw new AppError('Fornecedor nao encontrado', 'fornecedor');
            }

            return response.status(200).json(fornecedor);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarPor(request: Request, response: Response) {
        const atributo = request.params.atributo;
        const pesquisa = request.params.pesquisa;
        const query = request.query.pagina
        const pagina = query ? parseInt(query.toString()) : 1
        const itensPorPagina: number = 4

        const fornecedorRepository = getCustomRepository(FornecedorRepository);

        try {
            const fornecedorExiste = await fornecedorRepository.buscaPor(pesquisa, atributo, ((pagina - 1) * itensPorPagina), itensPorPagina);

            if (fornecedorExiste[0].length > 0) {
                fornecedorExiste[1] = Math.ceil(fornecedorExiste[1] / itensPorPagina);
                const data = {
                    providers: fornecedorExiste[0],
                    nPages: fornecedorExiste[1]
                }
                return response.status(201).json(data);
            } else {
                throw new AppError("Nenhum fornecedor encontrado", 'fornecedor');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarFornecedor(id: string) {
        const fornecedorRepository = getCustomRepository(FornecedorRepository);

        try {
            const fornecedor = await fornecedorRepository.buscaPorId(id);
            if (!fornecedor) {
                throw new AppError('Nenhum fornecedor encontrado', 'fornecedor');
            }
            return fornecedor;

        } catch (error) {
            throw error;
        }
    }
}
export { ControleFornecedor };