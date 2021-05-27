import { Request, Response } from 'express';
import { PessoaJuridicaRepository } from '../repositorios/PessoaJuridicaRepository';
import { EntityManager, getCustomRepository } from 'typeorm';
import { PessoaJuridica } from '../models/PessoaJuridica';

class ControlePessoaJuridica {
    async adicionar(request: Request, response: Response, pessoa, manager: EntityManager) {
        const { nomeFantasia, cnpj } = request.body;

        const pessoaJuridicaRepository = getCustomRepository(PessoaJuridicaRepository);

        const pessoaJuridica = pessoaJuridicaRepository.create({
            pessoa: pessoa,
            nomeFantasia,
            cnpj
        });
        try {
            const verif = await pessoaJuridicaRepository.verifica(pessoaJuridica)
            if (verif.length > 0) {
                throw verif;
            }
            const valida = await pessoaJuridicaRepository.validaDados(pessoaJuridica)
            if (valida.length > 0) {
                throw valida;
            }
            const result = await manager.save(pessoaJuridica);

            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async alterar(request: Request, response: Response, empresa, manager: EntityManager) {
        const { nomeFantasia, cnpj } = request.body;

        const pessoaJuridicaRepository = getCustomRepository(PessoaJuridicaRepository);

        const pessoaJuridica = pessoaJuridicaRepository.create({
            pessoa: empresa,
            nomeFantasia,
            cnpj
        });
        try {
            const valida = await pessoaJuridicaRepository.validaDados(pessoaJuridica);
            if (valida.length > 0) {
                throw valida;
            }
            const verifica = await pessoaJuridicaRepository.verifica(pessoaJuridica);
            if (verifica.length > 0) {
                throw verifica;
            }
            manager.update(PessoaJuridica, empresa.pessoaJuridica.pessoa.id, pessoaJuridica)
                .catch(error => { throw error });

        } catch (error) {
            throw error;
        }
    }
}
export { ControlePessoaJuridica };