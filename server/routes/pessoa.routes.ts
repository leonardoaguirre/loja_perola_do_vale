import { Router } from "express";
import { ControleCliente } from "../controllers/ControleCliente";
import { ControlePessoa } from "../controllers/ControlePessoa";

const controlePessoa = new ControlePessoa();
const pessoaRoutes = Router();
const controleCliente = new ControleCliente()

pessoaRoutes.post("/Adicionar", controleCliente.adicionar);
// pessoaRoutes.get('/Listar'/*,authMiddleware*/, controlePessoa.listar);
// pessoaRoutes.get("/Buscar/:atributo/:pesquisa", controlePessoa.buscar);
// pessoaRoutes.patch("/Alterar/:idPessoa", controlePessoa.alterar);
// pessoaRoutes.delete("/Deletar", controlePessoa.deletar);
pessoaRoutes.post("/Login", controlePessoa.login);

export { pessoaRoutes };
