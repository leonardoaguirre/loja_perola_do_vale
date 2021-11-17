import { Router } from "express";
import { ControleTelefone } from "../controllers/ControleTelefone";

const telefoneRoutes = Router();

const controleTelefone = new ControleTelefone();


telefoneRoutes.post("/Adicionar", controleTelefone.adicionarTelefone);
telefoneRoutes.get("/listar", controleTelefone.listar);
telefoneRoutes.get("/ListarPorId/:id", controleTelefone.listarPorId);
// telefoneRoutes.get("/buscaPorId", controleTelefone.buscarPorId);
telefoneRoutes.patch("/Alterar", controleTelefone.alterar)
telefoneRoutes.delete("/Deletar", controleTelefone.deletar)

export { telefoneRoutes };
