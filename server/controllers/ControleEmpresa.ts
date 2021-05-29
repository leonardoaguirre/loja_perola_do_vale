import { Request, Response } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { AppError } from '../errors/AppError';
import { EmpresaRepository } from '../repositorios/EmpresaRepository';
import { ControlePessoa } from './ControlePessoa';
import { ControlePessoaJuridica } from './ControlePessoaJuridica';
import { ControleTelefone } from './ControleTelefone';

class ControleEmpresa {
    async adicionar(request: Request, response: Response) {
        const empresaRepository = getCustomRepository(EmpresaRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaJuridica = new ControlePessoaJuridica();
        const controleTelefone = new ControleTelefone();

        try {
            await getManager().transaction(async manager => {
                const pessoa = await controlePessoa.adicionarPessoa(request, response, manager);

                const pessoaJuridica = await controlePessoaJuridica.adicionar(request, response, pessoa, manager);

                await controleTelefone.adicionar(request, response, pessoa, manager);

                const empresa = empresaRepository.create({pessoaJuridica});

                await manager.save(empresa);
            })

            return response.status(200).json("Empresa cadastrada com sucesso!");
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async alterar(request: Request, response: Response) {
        const empresaRepository = getCustomRepository(EmpresaRepository);
        const controlePessoa = new ControlePessoa();
        const controlePessoaJuridica = new ControlePessoaJuridica();
        const id = request.params.idempresa;

        try {
            const empresaExiste = await empresaRepository.buscaPorId(id);
            if (!empresaExiste) {
                throw new AppError('Empresa a ser alterado nao foi encontrado', 'empresa');
            }
            await getManager().transaction(async manager => {
                await controlePessoa.alterar(request, response, empresaExiste, manager);
                await controlePessoaJuridica.alterar(request, response, empresaExiste, manager);
            });

            return response.status(200).json({ message: "Empresa alterada com sucesso" });
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const empresaRepository = getCustomRepository(EmpresaRepository);
        const { id } = request.body;

        try {
            const existe = await empresaRepository.buscaPorId(id);
            if (existe) {
                await empresaRepository.delete(id);
                return response.status(200).json({ message: 'A empresa foi deletada com sucesso' });
            } else {
                throw new AppError('Empresa a ser deletada nao foi encontrada', 'empresa');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listar(request: Request, response: Response) {
        const empresaRepository = getCustomRepository(EmpresaRepository);

        await empresaRepository.find()
            .then(all => {
                if (all.length > 0) {
                    return response.status(200).json(all);
                } else {
                    return response.status(400).json(new AppError('Nenhuma empresa encontrada', 'empresa'));
                }
            })
    }
    async buscarPorId(request: Request, response: Response) {
        const id  = request.params.IdEmpresa;
        const empresaRepository = getCustomRepository(EmpresaRepository);

        try {
            const empresa = await empresaRepository.buscaPorId(id);
            if (!empresa) {
                throw new AppError('Empresa nao encontrada', 'empresa');
            }

            return response.status(200).json(empresa);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscarPor(request: Request, response: Response) {
        const atributo = request.params.atributo;
        const pesquisa = request.params.pesquisa;

        const empresaRepository = getCustomRepository(EmpresaRepository);

        try {
            const empresaExiste = await empresaRepository.buscaPor(pesquisa, atributo);

            if (empresaExiste.length > 0) {
                return response.status(201).json(empresaExiste);
            } else {
                throw new AppError("Nenhuma empresa encontrada", 'empresa');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
}
export { ControleEmpresa };