import { Router } from "express";
import { ControlePessoa } from "../controllers/ControlePessoa";
import cors from 'cors';

const controlePessoa = new ControlePessoa();
const pessoaRoutes = Router();

pessoaRoutes.post("/Adicionar", controlePessoa.adicionar);
pessoaRoutes.get('/Listar', controlePessoa.listar);
pessoaRoutes.get("/BuscaPorId/:idPessoa", controlePessoa.buscarPorId);
pessoaRoutes.patch("/Alterar/:idPessoa", controlePessoa.alterar)
pessoaRoutes.delete("/Deletar", controlePessoa.deletar)

export { pessoaRoutes };
