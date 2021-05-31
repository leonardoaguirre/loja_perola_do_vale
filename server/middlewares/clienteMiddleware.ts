import {Request, Response, NextFunction,} from 'express';
import jwt from 'jsonwebtoken';

export default function clienteMiddleware(req : Request , res : Response, next : NextFunction){
    const authorization = req.headers.authorization
    
    // req.

    if(!authorization){
        return res.status(401);
    }

    const token = authorization.replace('Bearer','').trim();

    try {
        
        // const data = jwt.verify(token,process.env.SECRET_KEY);
        const data = jwt.decode(token)

        
        console.log(data.toString);
        
        
        return next();

    } catch (error) {
        return res.status(401).json(error);
    }
}