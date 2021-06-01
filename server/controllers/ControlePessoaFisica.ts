import { Request, Response } from 'express';
import { PessoaFisicaRepository } from '../repositorios/PessoaFisicaRepository';
import { EntityManager, getCustomRepository } from 'typeorm';
import { PessoaFisica } from '../models/PessoaFisica';
import { Cliente } from '../models/Cliente';
import { AppError } from '../errors/AppError';

class ControlePessoaFisica {
    async adicionar(request: Request, response: Response, pessoa, manager: EntityManager) {
        const { nome, rg, cpf, dtNasc } = request.body;

        const pessoaFisicaRepository = getCustomRepository(PessoaFisicaRepository);

        const pessoaFisica = pessoaFisicaRepository.create({
            pessoa: pessoa,
            nome,
            rg,
            cpf,
            dtNasc,
        });
        try {
            const verif = await pessoaFisicaRepository.verifica(pessoaFisica)
            if (verif.length > 0) {
                throw verif;
            }
            const valida = await pessoaFisicaRepository.validaDados(pessoaFisica)
            if (valida.length > 0) {
                throw valida;
            }
            const result = await manager.save(pessoaFisica);

            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async alterar(request: Request, response: Response, cliente: Cliente, manager: EntityManager) {
        const { nome, rg, cpf, dtNasc } = request.body;

        const pessoaFisicaRepository = getCustomRepository(PessoaFisicaRepository);

        const pessoaFisica = pessoaFisicaRepository.create({
            nome,
            rg,
            cpf,
            dtNasc,
        });
        try {
            const valida = await pessoaFisicaRepository.validaDados(pessoaFisica);
            if (valida.length > 0) {
                throw valida;
            }
            const verifica = await pessoaFisicaRepository.verificaAlteracao(pessoaFisica, cliente.pessoaFisica.pessoaFisicaId);
            if (verifica.length > 0) {
                throw verifica;
            }
            await manager.update(PessoaFisica, cliente.pessoaFisica.pessoaFisicaId, pessoaFisica)
                .then(res => {
                    if (res.affected < 1) {
                        throw new AppError('Update sem sucesso!', 'update');
                    }
                })
                .catch(err => { throw err })

        } catch (error) {
            throw error;
        }
    }
}
export { ControlePessoaFisica };