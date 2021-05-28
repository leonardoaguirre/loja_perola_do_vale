import { Request, Response } from 'express';
import { CategoriaRepository } from '../repositorios/CategoriaRepository';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';

class ControleCategoria {
    async adicionar(request: Request, response: Response) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);
        const { descricao } = request.body;

        const categoria = categoriaRepository.create({
            descricao,
        });

        await categoriaRepository.validaDados(categoria)
            .then(async result => {
                if (result.length > 0) {
                    throw result;
                } else {
                    await categoriaRepository.verifica(categoria)
                        .then(result => {
                            if (result.length > 0) {
                                throw new AppError('Categoria já cadastrada', 'categoria');
                            }
                        }).catch(erro => { throw erro })
                    await categoriaRepository.save(categoria)
                        .then(result => {
                            if (result) {
                                return response.status(201).json({ message: "Categoria cadastrada com sucesso" });
                            } else {
                                throw { message: 'Categoria nao cadastrada' }
                            }
                        })
                }
            })
            .catch(error => { return response.status(400).json(error) })
    }
    async listar(request: Request, response: Response) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);

        await categoriaRepository.find()
            .then((result) => {
                if (result.length > 0) {
                    return response.status(200).json(result);
                } else {
                    return response.status(400).json(new AppError('Nenhuma Categoria encontrada', 'categoria'));
                }
            });
    }
    async buscaPorId(request: Request, response: Response) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);
        const id = request.params.idcategoria;

        await categoriaRepository.buscaPorId(id)
            .then((result) => {
                if (result) {
                    return response.status(201).json(result);
                } else {
                    throw new AppError('Nenhuma categoria encontrada', 'categoria');
                }
            })
            .catch(error => { return response.status(400).json(error) });
    }
    async buscaCategoria(id: string) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);

        try {
            const categoria = await categoriaRepository.buscaPorId(id);
            if (!categoria) {
                throw new AppError('Categoria nao encontrada', 'categoria');
            }
            return categoria;

        } catch (error) {
            throw error;
        }
    }
    async alterar(request: Request, response: Response) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);
        const { descricao } = request.body;
        const id = request.params.idcategoria;

        const categoria = categoriaRepository.create({ descricao });

        await categoriaRepository.validaDados(categoria)
            .then(async (result) => {
                if (result.length > 0) {
                    return response.status(400).json(result);
                } else {
                    await categoriaRepository.verifica(categoria)
                        .then(result => {
                            if (result.length > 0) {
                                throw new AppError('Categoria já cadastrada', 'categoria');
                            }
                        }).catch(error => { throw error })

                    await categoriaRepository.update(id, categoria)
                        .then(result => {
                            if (result.affected) {
                                return response.status(201).json({ message: "Categoria alterada com sucesso" })
                            } else {
                                return response.status(400).json(result)
                            }
                        })
                }
            }).catch(error => { return response.status(400).json(error) })
    }
    async deletar(request: Request, response: Response) {
        const categoriaRepository = getCustomRepository(CategoriaRepository);
        const { id } = request.body;

        await categoriaRepository.findOne(id)
            .then(async result => {
                if (result) {
                    await categoriaRepository.delete(id).then(result => {
                        if (result.affected) {
                            return response.status(200).json({ message: "A categoria foi deletada com sucessso!" })
                        } else {
                            return response.status(400).json(result)
                        }
                    })
                } else {
                    throw new AppError('Categoria nao encontrada', 'categoria');
                }
            }).catch(error => { return response.status(400).json(error) })
    }
}
export { ControleCategoria };