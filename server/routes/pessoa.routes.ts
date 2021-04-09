import { Router } from "express";
import { ControlePessoa } from "../controllers/ControlePessoa";
<<<<<<< HEAD
import authMiddleware from '../middlewares/authMiddleware';
=======
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

const controlePessoa = new ControlePessoa();
const pessoaRoutes = Router();

pessoaRoutes.post("/Adicionar", controlePessoa.adicionar);
<<<<<<< HEAD
pessoaRoutes.get('/Listar',authMiddleware, controlePessoa.listar);
pessoaRoutes.get("/BuscaPorId/:idPessoa", controlePessoa.buscarPorId);
pessoaRoutes.patch("/Alterar/:idPessoa", controlePessoa.alterar);
pessoaRoutes.delete("/Deletar", controlePessoa.deletar);
pessoaRoutes.post("/Login", controlePessoa.login);
=======
pessoaRoutes.get('/Listar', controlePessoa.listar);
pessoaRoutes.get("/BuscaPorId/:idPessoa", controlePessoa.buscarPorId);
pessoaRoutes.patch("/Alterar/:idPessoa", controlePessoa.alterar)
pessoaRoutes.delete("/Deletar", controlePessoa.deletar)
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

export { pessoaRoutes };
