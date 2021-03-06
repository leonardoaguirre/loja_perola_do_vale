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
            await favoritoRepository.save(favorito).then((res) => {
                return response.status(200).json({ idFavorito: res.id });
            });

        } catch (error) {
            return response.status(400).json(error);
        }

    }
    async listar(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);

        try {
            await favoritoRepository.find({ loadRelationIds: true }).then((res) => {
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
            await favoritoRepository.find({ where: { pessoa: { id: idPessoa } }/*, loadRelationIds: true*/ }).then((res) => {
                if (res.length>0) {
                    // delete res['pessoa']
                    return response.status(200).json(res);
                } else {
                    throw new AppError("Favoritos nao encontrados", 'favorito');
                }

            })
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async verificaFavorito(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const { idProduto } = request.params;
        const idPessoa = request.query.idPessoa;
        let favoritado = false;
        let idFavorito = null;

        try {
            if (idPessoa && idPessoa.length === 36) {
                await favoritoRepository.findOne({ where: { pessoa: { id: idPessoa }, produto: { id: idProduto } } })
                    .then(async res => {
                        if (res) {
                            favoritado = true;
                            idFavorito = res.id
                        }
                        const nFavoritos = await favoritoRepository.findAndCount({ where: { produto: { id: idProduto } } });
                        return response.status(200).json({ favoritado, nFavoritos: nFavoritos[1], idFavorito });
                    })
            } else {
                const nFavoritos = await favoritoRepository.findAndCount({ where: { produto: { id: idProduto } } });
                return response.status(200).json({ nFavoritos: nFavoritos[1] });
            }

        } catch (error) {
            return response.status(400).json(error);
        }
    }

    //Deleta o favorito por id da pessoa e id do produto, usado no product/info
    async deletar(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const { idProduto, idPessoa } = request.body;

        try {
            await favoritoRepository.findOne({ where: { pessoa: { id: idPessoa }, produto: { id: idProduto } } }).then(async res => {
                if (res) {
                    await favoritoRepository.delete(res);
                    return response.status(200).json({ message: "Favorito foi deletado com sucessso!" });
                } else {
                    throw new AppError("O favorito a ser deletado nao foi encontrado", 'favorito');
                }
            }).catch(erro => { throw erro });

        } catch (error) {
            return response.status(400).json(error);
        }
    }

    //Deleta favorito por id do favorito, usado na tela de user/favorites
    async deletarPorId(request: Request, response: Response) {
        const favoritoRepository = getCustomRepository(FavoritoRepository);
        const { idFavorito } = request.body;

        try {
            await favoritoRepository.findOne({ id: idFavorito }).then(async res => {
                if (res) {
                    await favoritoRepository.delete(res.id.toString());
                    return response.status(200).json({ message: "Favorito foi deletado com sucessso!" });
                } else {
                    throw new AppError("O favorito a ser deletado nao foi encontrado", 'favorito');
                }
            }).catch(erro => { throw erro });

        } catch (error) {
            return response.status(400).json(error);
        }
    }

}
export { ControleFavorito };