import { Router } from "express";
import { ControleTelefone } from "../controllers/ControleTelefone";

const telefoneRoutes = Router();

const controleTelefone = new ControleTelefone();


// telefoneRoutes.post("/adicionar", controleTelefone.adicionar);
telefoneRoutes.get("/listar", controleTelefone.listar);
telefoneRoutes.get("/ListarPorId/:id", controleTelefone.listarPorId);
// telefoneRoutes.get("/buscaPorId", controleTelefone.buscarPorId);
telefoneRoutes.patch("/alterar", controleTelefone.alterar)
telefoneRoutes.delete("/deletar", controleTelefone.deletar)

export { telefoneRoutes };
