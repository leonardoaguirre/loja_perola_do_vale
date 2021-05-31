import { Request, Response, NextFunction, } from 'express';
import jwt from 'jsonwebtoken';
import { ControleCliente } from '../controllers/ControleCliente';
import { AppError } from '../errors/AppError';

export default async function clienteAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {

        const data = jwt.verify(token, process.env.SECRET_KEY);

        const controleCli = new ControleCliente();
        const cliExiste = await controleCli.buscarCliente(data['id']);

        if (!cliExiste) {
            throw new AppError('cliente não encontrado', 'cliente')
        }
        return next();

    } catch (error) {
        return res.status(401).json(error);
    }
}