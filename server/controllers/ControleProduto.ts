import { Request, Response, NextFunction } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { AppError } from '../errors/AppError';
import { Categoria } from '../models/Categoria';
import { ProdutoRepository } from '../repositorios/ProdutoRepository';
import { ControleCategoria } from './ControleCategoria';
import fs from 'fs';
import { ControleImgs } from './ControleImgs';
import { Imagem } from '../models/Imagem';
import { Produto } from '../models/Produto';

class ControleProduto {
    async adicionar(request: Request, response: Response, next: NextFunction) {
        const produtoRepository = getCustomRepository(ProdutoRepository);
        const { nome, marca, descricao, valorVenda, codBarra, quantidade, peso, altura, largura, comprimento } = request.body;
        const categoriasBody: string[] = request.body.categorias;

        const categorias = new Array<Categoria>();
        const imgs = new Array<Imagem>();
        const controleCategoria = new ControleCategoria();
        const controleImgs = new ControleImgs();

        for (const cat of categoriasBody) {
            categorias.push(await controleCategoria.buscaCategoria(cat));
        }
        for (const img of await controleImgs.getImgs(request)) {
            imgs.push(img);
        }

        const produto: Produto = produtoRepository.create({
            nome,
            marca,
            descricao,
            valorVenda,
            codBarra: codBarra,
            quantidade,
            peso,
            altura,
            largura,
            comprimento,
            categorias: categorias,
        });

        try {
            if (request.files.length == 0) {
                throw new AppError("O produto deve conter pelo menos 1 imagem.", 'produto')
            }

            await getManager().transaction(async transactionalEntityManager => {

                const valida = await produtoRepository.validaDados(produto);
                if (valida.length > 0) {
                    throw valida;
                }
                const verifica = await produtoRepository.verifica(produto);
                if (verifica) {
                    throw new AppError('Produto ja cadastrado', 'produto');
                }
                await controleImgs.adicionar(request, response, await transactionalEntityManager.save(produto), transactionalEntityManager);
            });

            return response.status(200).json({ message: 'Produto cadastrado com sucesso' });

        } catch (error) {
            //exclui somente as imagens que foram tentadas a serem inseridas
            for (const img of imgs) {
                fs.rm(img.path, { recursive: true, force: true, }, (error) => {
                    if (error) throw error;
                })
            }
            return response.status(400).json(error);
        }
    }
    async alterar(request: Request, response: Response) {
        const produtoRepository = getCustomRepository(ProdutoRepository);
        const { nome, marca, descricao, valorVenda, codBarra, quantidade, peso, altura, largura, comprimento } = request.body;
        const categoriasBody: string[] = request.body.categorias;

        const id = request.params.idProduto;

        const imgs = Array<Imagem>();
        const categorias = new Array<Categoria>();
        const controleCategoria = new ControleCategoria();
        const controleImgs = new ControleImgs();


        const produto = produtoRepository.create({
            nome,
            marca,
            descricao,
            valorVenda,
            codBarra: codBarra,
            quantidade,
            peso,
            altura,
            largura,
            comprimento,
        });


        try {
            if (request.files.length == 0) {
                throw new AppError("O produto deve conter pelo menos 1 imagem", 'produto')
            }
            await getManager().transaction(async transactionalEntityManager => {

                const prodExiste = await produtoRepository.findOne(id);
                if (!prodExiste) {
                    throw new AppError('Produto não existe', 'produto');
                }

                const valida = await produtoRepository.validaDados(produto);
                if (valida.length > 0) {
                    throw valida;
                }
                const verifica = await produtoRepository.verifica(produto);
                if (verifica && (prodExiste.codBarra !== produto.codBarra) && (produto.codBarra == verifica.codBarra)) {
                    throw new AppError('Codigo de barra ja cadastrado', 'produto');
                }
                for (const cat of categoriasBody) {
                    categorias.push(await controleCategoria.buscaCategoria(cat));
                }
                for (const img of prodExiste.imagens) {
                    await transactionalEntityManager.delete(Imagem, img.id);
                    fs.rm(img.path, { recursive: true, force: true, }, (error) => {
                        if (error) throw error;
                    })
                }

                const produtoAlterado = transactionalEntityManager.merge(Produto, prodExiste, {
                    nome: produto.nome,
                    marca: produto.marca,
                    descricao: produto.descricao,
                    valorVenda: produto.valorVenda,
                    codBarra: produto.codBarra,
                    quantidade: produto.quantidade,
                    peso: produto.peso,
                    altura: produto.altura,
                    largura: produto.largura,
                    comprimento: produto.comprimento,
                    categorias: categorias,
                })
                for (const img of await controleImgs.getImgs(request)) {
                    img.produto = produtoAlterado;
                    imgs.push(img);
                }
                produtoAlterado.imagens = imgs;

                await transactionalEntityManager.save(produtoAlterado)
                    .then(async () => {
                        await transactionalEntityManager.save(imgs)
                            .catch(res => { throw res })
                    })
                    .catch(res => { throw res })
            });

            return response.status(200).json({ message: 'Produto alterado com sucesso' });

        } catch (error) {
            //exclui somente as imagens que foram tentadas a serem inseridas
            for (const img of imgs) {
                fs.rm(img.path, { recursive: true, force: true, }, (error) => {
                    if (error) throw error;
                })
            }
            return response.status(400).json(error);
        }
    }
    async deletar(request: Request, response: Response) {
        const produtoRepository = getCustomRepository(ProdutoRepository);
        const { id } = request.body;

        try {
            const existe = await produtoRepository.buscaPorId(id);
            if (existe) {
                const dir = existe.imagens[0].destination;

                await produtoRepository.delete(existe.id);

                fs.rm(dir, { recursive: true, force: true }, (error) => {
                    if (error) {
                        throw error;
                    }
                });

                return response.status(200).json({ message: "Produto deletado com sucesso" });
            } else {
                throw new AppError('Produto a ser deletado nao foi encontrado', 'cliente');
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async listar(request: Request, response: Response) {
        const produtoRepository = getCustomRepository(ProdutoRepository);

        await produtoRepository.find().then(result => {
            if (result.length > 0) {
                return response.status(200).json(result);
            } else {
                return response.status(400).json(new AppError('Nenhum produto encontrado', 'produto'));
            }
        })
    }
    async buscarPorId(request: Request, response: Response) {
        const id = request.params.idProduto;
        const produtoRepository = getCustomRepository(ProdutoRepository);

        try {
            const produto = await produtoRepository.buscaPorId(id);

            if (!produto) {
                throw new AppError('produto nao encontrado', 'produto');
            }

            return response.status(200).json(produto);
        } catch (error) {
            return response.status(400).json(error);
        }
    }
    async buscaProduto(id: string) {
        const produtoRepository = getCustomRepository(ProdutoRepository);

        try {
            const produto = await produtoRepository.buscaPorId(id);
            if (!produto) {
                throw new AppError('Nenhum produto encontrado', 'produto');
            }
            return produto;

        } catch (error) {
            throw error;
        }
    }
    async procurar(request: Request, response: Response) {
        const pesquisa = request.params.pesquisa;
        const produtoRepository = getCustomRepository(ProdutoRepository);

        await produtoRepository.procura(pesquisa)
            .then(res => {
                if (res.length == 0) {
                    throw new AppError('Nenhum produto encontrado', 'produto');
                }
                return response.status(200).json(res);
            }).catch(err => {
                return response.status(400).json(err);
            })
    }
}
export { ControleProduto };