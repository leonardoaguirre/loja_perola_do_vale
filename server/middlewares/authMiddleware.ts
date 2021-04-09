import {Request, Response, NextFunction,} from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-session' {
    interface SessionData {
      user: User;
    }
  }
export default function authMiddleware(req : Request , res : Response, next : NextFunction){
    // const {authorization} = req.headers;
    req.

    if(!authorization){
        return res.sendStatus(401);
    }
    const token =authorization.replace('Bearer','').trim();

    try {
        const data = jwt.verify(token,process.env.SECRET_KEY);

        return next(data);

    } catch (error) {
        return res.sendStatus(401).json(error);
    }
}