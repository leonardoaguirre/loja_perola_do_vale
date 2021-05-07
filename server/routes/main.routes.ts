import { Router } from "express";
import {pessoaRoutes} from "./pessoa.routes";
import {telefoneRoutes} from "./telefone.routes";
import {enderecoRoutes} from "./endereco.routes";
import {clienteRoutes} from "./cliente.routes";

const routes = Router();

routes.use("/Pessoa",pessoaRoutes);
routes.use("/Telefone",telefoneRoutes);
routes.use("/Endereco",enderecoRoutes);
routes.use("/Cliente",clienteRoutes);


export {routes}