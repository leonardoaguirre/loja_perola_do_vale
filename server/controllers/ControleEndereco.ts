import { getCustomRepository } from "typeorm";
import { EnderecoRepository } from "../repositorios/EnderecoRepository";
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError'
import { validar } from '../services/validaDados'

class ControleEndereco {
    async adicionar(request: Request, response: Response) {
        const enderecoRespository = getCustomRepository(EnderecoRepository);
        const { idPessoa, cep, rua, numero, complemento, titulo, bairro, cidade, estado } = request.body;

        const endereco = enderecoRespository.create({
            id_pessoa_fk: idPessoa,
            cep,
            rua,
            complemento,
            numero,
            bairro,
            cidade,
            estado,
            titulo
        });

        try {
            await validar(endereco)
            await enderecoRespository.save(endereco)
                .then(result => {
                    if (result) {
                        return response.status(201).json({ message: "Endereço cadastrado com sucesso" });
                    } else {
                        throw { message: 'Endereco nao cadastrado' }
                    }
                })
        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async listar(request: Request, response: Response) {
        const enderecoRespository = getCustomRepository(EnderecoRepository);

        await enderecoRespository.find()
            .then((result) => {
                if (result.length > 0) {
                    return response.status(200).json(result);
                } else {
                    return response.status(400).json(new AppError('Nenhum telefone encontrado', 'telefone'));
                }
            });
    }
    async listarPorId(request: Request, response: Response) {
        const enderecoRespository = getCustomRepository(EnderecoRepository);
        const id = request.params.idPessoa;

        enderecoRespository.listaPorId(id)
            .then((result) => {
                if (result.length > 0) {
                    return response.status(201).json(result);
                } else {
                    throw new AppError('Nenhum endereco registrado', 'endereco');
                }
            })
            .catch(error => { return response.status(400).json(error) });
    }
    async alterar(request: Request, response: Response) {
        const enderecoRespository = getCustomRepository(EnderecoRepository);
        const { idEndereco, idPessoa, cep, complemento, titulo, rua, numero, bairro, cidade, estado } = request.body;

        try {
            const enderecoExiste = await enderecoRespository.findOne({ relations: ['pessoa'], where: { id: idEndereco, pessoa: { id: idPessoa } } })
            if (enderecoExiste) {
                const endereco = enderecoRespository.create({
                    id: idEndereco,
                    id_pessoa_fk: idPessoa,
                    cep,
                    complemento,
                    rua,
                    numero,
                    bairro,
                    cidade,
                    estado,
                    titulo
                })
                await validar(endereco)

                await enderecoRespository.save(endereco)
                    .then(() => {
                        return response.status(201).json('Endereço alterado com sucesso')
                    })
                    .catch((errors) => {
                        return response.status(400).json(errors);
                    })

            } else {
                throw new AppError("Endereço ou usuario nao encontrado ", 'endereco');
            }

        } catch (error) {
            return response.status(400).json(error)
        }
    }

    async deletar(request: Request, response: Response) {
        const enderecoRespository = getCustomRepository(EnderecoRepository);
        const { id } = request.body;

        await enderecoRespository.findOne(id)
            .then(async result => {
                if (result) {
                    await enderecoRespository.delete(id).then(result => {
                        if (result.affected) {
                            return response.status(200).json({ message: "O endereco foi deletado com sucessso!", result })
                        } else {
                            return response.status(400).json(result)
                        }
                    })
                } else {
                    throw new AppError('Endereco nao encontrado', 'endereco');
                }
            }).catch(error => { return response.status(400).json(error) })
    }
}
export { ControleEndereco };