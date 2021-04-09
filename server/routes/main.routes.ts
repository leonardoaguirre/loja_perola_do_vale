import { Router } from "express";
import {pessoaRoutes} from "./pessoa.routes";
import {telefoneRoutes} from "./telefone.routes";
import {enderecoRoutes} from "./endereco.routes";

const routes = Router();

routes.use("/Pessoa",pessoaRoutes);
routes.use("/Telefone",telefoneRoutes);
routes.use("/Endereco",enderecoRoutes);

export {routes}