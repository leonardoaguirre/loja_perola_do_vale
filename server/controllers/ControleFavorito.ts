import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { FavoritoRepository } from '../repositorios/FavoritoRepository';
import { ControlePessoa } from './ControlePessoa';
import { ControleProduto } from './ControleProduto';

class ControleFavorito {
    async adicionar(request: Request, response: Response) {
        const { idPessoa, idProduto } = request.body;
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const controleProduto = new ControleProduto();
        const controlePessoa = new ControlePessoa();

        const favorito = favoritoRepository.create({
            pessoa: { id: idPessoa },
            produto: { id: idProduto }
        })
        try {
            const prodExiste = await controleProduto.buscaProduto(favorito.produto.id);
            const pessoaExiste = await controlePessoa.buscaPessoa(favorito.pessoa.id);

            if (!prodExiste && !pessoaExiste) {
                throw new AppError('Produto ou pessoa inexistente!', 'erro')
            }
            const favExiste = await favoritoRepository.verifica(favorito)
            if (favExiste) {
                throw new AppError('Este item ja foi favoritado!', 'favorito');
            }
            favoritoRepository.save(favorito);
            return response.status(200).json('Favorito adicionado com sucesso!');

        } catch (error) {
            return response.status(400).json(error);
        }

    }
    async listar(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);

        try {
            await favoritoRepository.find({loadRelationIds : true}).then((res) => {
                if (res.length > 0) {
                    return response.status(200).json(res);
                } else {
                    throw new AppError("Nenhum favorito foi encontrado", 'favorito');
                }
            })
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listarPorPessoa(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const idPessoa = request.params.idPessoa;

        try {
            await favoritoRepository.find({ where: { pessoa: { id: idPessoa } },loadRelationIds:true }).then((res) => {
                if (res) {
                    return response.status(200).json(res);
                } else {
                    throw new AppError("Favoritos nao encontrados", 'favorito');
                }

            })
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const { idFavorito } = request.body;

        try {
            if (await favoritoRepository.findOne(idFavorito)) {
                await favoritoRepository.delete(idFavorito);
                return response.status(200).json({ message: "Favorito foi deletado com sucessso!" });
            } else {
                throw new AppError("O favorito a ser deletado nao foi encontrado", 'favorito');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }

}
export { ControleFavorito };