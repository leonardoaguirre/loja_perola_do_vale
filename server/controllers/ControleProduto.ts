import { Request, Response, NextFunction } from 'express';
import { getCustomRepository, getManager } from 'typeorm';
import { AppError } from '../errors/AppError';
import { Categoria } from '../models/Categoria';
import { ProdutoRepository } from '../repositorios/ProdutoRepository';
import { ControleCategoria } from './ControleCategoria';
import fs from 'fs';
import path from 'path';
import { ControleImgs } from './ControleImgs';
import { Imagem } from '../models/Imagem';
import { Produto } from '../models/Produto';

class ControleProduto {
    async adicionar(request: Request, response: Response, next: NextFunction) {
        const produtoRepository = getCustomRepository(ProdutoRepository);
        const { nome, marca, descricao, valorVenda, codBarra, quantidade, peso, altura, largura, comprimento } = request.body;
        const categoriasBody: [string] = request.body.categorias;


        const categorias = new Array<Categoria>();
        const controleCategoria = new ControleCategoria();
        const controleImgs = new ControleImgs();

        for (const cat of categoriasBody) {
            categorias.push(await controleCategoria.buscaCategoria(cat));
        }

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
            categorias: categorias
        });
        //variavel de retorno da insercao das imagens fora do try
        let imgs = new Array<Imagem>();
        try {
            await getManager().transaction(async transactionalEntityManager => {

                const prod = await transactionalEntityManager.save(produto);
                imgs = await controleImgs.adicionar(request, response, prod, transactionalEntityManager);

                const valida = await produtoRepository.validaDados(produto);
                if (valida.length > 0) {
                    throw valida;
                }
                const verifica = await produtoRepository.verifica(produto);
                if (verifica) {
                    throw new AppError('Produto ja cadastrado', 'produto');
                }
            });

            return response.status(200).json({ message: 'Produto cadastrado com sucesso' });

        } catch (error) {
            //exclui somente as imagens que foram tentadas a serem inseridas
            for (const img of imgs) {
                // const dir = path.resolve('uploads', 'imgs', produto.codBarra.toString(), img.);
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
        const categoriasBody: [string] = request.body.categorias;
        const id = request.params.idCliente;


        const categorias = new Array<Categoria>();
        const controleCategoria = new ControleCategoria();
        const controleImgs = new ControleImgs();

        for (const cat of categoriasBody) {
            categorias.push(await controleCategoria.buscaCategoria(cat));
        }
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
            categorias: categorias
        });

        try {
            await getManager().transaction(async transactionalEntityManager => {
                const prodExiste = await produtoRepository.findOne(id);
                if (!prodExiste) {
                    throw new AppError('Produto não existe','produto');
                }
                const prod = await transactionalEntityManager.update(Produto,id,produto);
                await controleImgs.adicionar(request, response, prodExiste, transactionalEntityManager);

                const valida = await produtoRepository.validaDados(produto);
                if (valida.length > 0) {
                    throw valida;
                }
                const verifica = await produtoRepository.verifica(produto);
                if (verifica) {
                    throw new AppError('Produto ja cadastrado', 'produto');
                }
            });

            return response.status(200).json({ message: 'Produto cadastrado com sucesso' });

        } catch (error) {
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
        const { id } = request.body;
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
}
export { ControleProduto };