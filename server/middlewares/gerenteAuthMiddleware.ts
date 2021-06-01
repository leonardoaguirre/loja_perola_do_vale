import { Request, Response, NextFunction, } from 'express';
import jwt from 'jsonwebtoken';
import { ControleCliente } from '../controllers/ControleCliente';
import { ControleFuncionario } from '../controllers/ControleFuncionario';
import { AppError } from '../errors/AppError';

export default async function gerenteAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401);
    }

    
    const token = authorization.replace('Bearer', '').trim();

    try {

        const data = jwt.verify(token, process.env.SECRET_KEY);

        const controleFunc = new ControleFuncionario();
        const gerenteExiste = await controleFunc.buscarGerente(data['id']);

        if (!gerenteExiste) {
            throw new AppError('Gerente não encontrado', 'gerente')
        }
        return next();

    } catch (error) {
        return res.status(401).json(error);
    }
}