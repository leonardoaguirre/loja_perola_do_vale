import { Request, Response } from 'express';
import { PessoaFisicaRepository } from '../repositorios/PessoaFisicaRepository';
import { EntityManager, getCustomRepository } from 'typeorm';
import { PessoaFisica } from '../models/PessoaFisica';
import { Cliente } from '../models/Cliente';

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
    async alterar(request: Request, response: Response, cliente : Cliente, manager: EntityManager) {
        const { nome, rg, cpf, dtNasc } = request.body;

        const pessoaFisicaRepository = getCustomRepository(PessoaFisicaRepository);

        const pessoaFisica = pessoaFisicaRepository.create({
            pessoa: cliente.pessoaFisica.pessoa,
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
            const verifica = await pessoaFisicaRepository.verifica(pessoaFisica);
            if (verifica.length > 0) {
                throw verifica;
            }
            manager.update(PessoaFisica, cliente.pessoaFisica.pessoa.id, pessoaFisica)
                .catch(error => { throw error });

        } catch (error) {
            throw error;
        }
    }
}
export { ControlePessoaFisica };