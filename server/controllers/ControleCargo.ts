import { Request, Response } from 'express';
import { CargoRepository } from '../repositorios/CargoRepository';
import { EntityManager, getCustomRepository } from 'typeorm';
import { Cargo } from '../models/Cargo';
import { AppError } from '../errors/AppError';

class ControleCargo {
    async adicionar(request: Request, response: Response) {
        const cargoRepository = getCustomRepository(CargoRepository);
        const { descricao } = request.body;

        const cargo = cargoRepository.create({
            descricao,
        });

        await cargoRepository.validaDados(cargo)
            .then(async result => {
                if (result.length > 0) {
                    throw result;
                } else {
                    await cargoRepository.verifica(cargo)
                        .then(result => {
                            if (result.length > 0) {
                                throw new AppError('Cargo já cadastrado', 'cargo');
                            }
                        }).catch(erro => { throw erro })
                    await cargoRepository.save(cargo)
                        .then(result => {
                            if (result) {
                                return response.status(201).json({ message: "Cargo cadastrado com sucesso" });
                            } else {
                                throw { message: 'Cargo nao cadastrado' }
                            }
                        })
                }
            })
            .catch(error => { return response.status(400).json(error) })
    }
    async listar(request: Request, response: Response) {
        const cargoRepository = getCustomRepository(CargoRepository);

        await cargoRepository.find()
            .then((result) => {
                if (result.length > 0) {
                    return response.status(200).json(result);
                } else {
                    return response.status(400).json(new AppError('Nenhum cargo encontrado', 'cargo'));
                }
            });
    }
    async buscaPorId(request: Request, response: Response) {
        const cargoRepository = getCustomRepository(CargoRepository);
        const id = request.params.idCargo;

        cargoRepository.buscaPorId(id)
            .then((result) => {
                if (result) {
                    return response.status(201).json(result);
                } else {
                    throw new AppError('Nenhum cargo encontrado', 'cargo');
                }
            })
            .catch(error => { return response.status(400).json(error) });
    }
    async buscaCargo(id: string) {
        const cargoRepository = getCustomRepository(CargoRepository);

        try {
            const cargo = await cargoRepository.buscaPorId(id);
            if (!cargo) {
                throw new AppError('Nenhum cargo encontrado', 'cargo');
            }
            return cargo;

        } catch (error) {
            throw error;
        }
    }
    async alterar(request: Request, response: Response) {
        const cargoRepository = getCustomRepository(CargoRepository);
        const { descricao } = request.body;
        const id = request.params.idCargo;

        const cargo = cargoRepository.create({ descricao });

        await cargoRepository.validaDados(cargo)
            .then(async (result) => {
                if (result.length > 0) {
                    return response.status(400).json(result);
                } else {
                    await cargoRepository.verifica(cargo)
                        .then(result => {
                            if (result.length > 0) {
                                throw new AppError('Cargo já cadastrado', 'cargo');
                            }
                        }).catch(error => { throw error })

                    await cargoRepository.update(id, cargo)
                        .then(result => {
                            if (result.affected) {
                                return response.status(201).json({ message: "Cargo alterado com sucesso" })
                            } else {
                                return response.status(400).json(result)
                            }
                        })
                }
            }).catch(error => { return response.status(400).json(error) })
    }
    async deletar(request: Request, response: Response) {
        const cargoRepository = getCustomRepository(CargoRepository);
        const { id } = request.body;

        await cargoRepository.findOne(id)
            .then(async result => {
                if (result) {
                    await cargoRepository.delete(id).then(result => {
                        if (result.affected) {
                            return response.status(200).json({ message: "O cargo foi deletado com sucessso!" })
                        } else {
                            return response.status(400).json(result);
                        }
                    })
                } else {
                    throw new AppError('Cargo nao encontrado', 'cargo');
                }
            }).catch(error => { return response.status(400).json(error) })
    }
}
export { ControleCargo };