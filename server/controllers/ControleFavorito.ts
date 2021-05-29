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
            if(await favoritoRepository.verifica(favorito)){
                throw new AppError('Este item ja foi favoritado!','favorito');
            }
            const prodExiste = await controleProduto.buscaProduto(favorito.produto.id);
            const pessoaExiste = await controlePessoa.buscaPessoa(favorito.pessoa.id);
            
            if (prodExiste && pessoaExiste) {
                favoritoRepository.save(favorito);
                return response.status(200).json('Favorito adicionado com sucesso!');
            } else {
                throw new AppError('Produto ou pessoa inexistente!', 'erro')
            }
        } catch (error) {
            return response.status(400).json(error);
        }

    }
    async listar(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);

        try {
            await favoritoRepository.find().then((res) => {
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
            await favoritoRepository.find({ where: { pessoa: { id: idPessoa } } }).then((res) => {
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