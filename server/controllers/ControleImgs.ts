import { NextFunction, Request, Response } from 'express';
import { upload } from '../uploads/uploadImgs';
import multer, { Multer } from 'multer';
import { EntityManager, getCustomRepository, getManager } from 'typeorm';
import { Produto } from '../models/Produto';
import { Imagem } from '../models/Imagem';
import { ImagemRepository } from '../repositorios/ImagemRepository';
import { AppError } from '../errors/AppError';

class ControleImgs {
    async adicionar(request: Request, response: Response, prod: Produto, manager: EntityManager) {
        const imagens = new Array<Imagem>();
        const imgRepository = getCustomRepository(ImagemRepository)
        try {
            for (let i = 0; i < request.files.length; i++) {
                const img = request.files[i];

                imagens.push(imgRepository.create({
                    originalName: img.originalname,
                    mimetype: img.mimetype,
                    destination: img.destination,
                    filename: img.filename,
                    path: img.path,
                    size: img.size,
                    produto: prod
                }));
            }

            await manager.save(imagens);
            return imagens;
        } catch (error) {
            throw error;
        }

    }
    async deletar(request: Request, response: Response, prod: Produto, manager: EntityManager) {
        for(const img of prod.imagens){
            manager.delete(Imagem,img.id)
            .then(res=>{
            }).catch(err =>{
                throw err;
            });
        }
    }
    async teste(request: Request, response: Response) {
        return response.status(200).json(request.body.categorias);

    }

}
export { ControleImgs };