import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import createConnection from "../infra/database/conexao";
import { routes } from "../routes/main.routes";
import { AppError } from "../errors/AppError";
import cors from 'cors';
require("dotenv").config();

createConnection();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true }));
app.use('/uploads/imgs', express.static('uploads/imgs'));

app.use(cors());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`,
    });
  }
);

export { app };
