import { Router } from "express";
import { ControleEndereco } from "../controllers/ControleEndereco";

const enderecoRoutes = Router();
const controleEndereco = new ControleEndereco();


// enderecoRoutes.post("/adicionar", controleEndereco.adicionar);
// enderecoRoutes.get("/listar", controleEndereco.listar);
// enderecoRoutes.get("/buscaPorId", controleEndereco.buscarPorId);
// enderecoRoutes.patch("/alterar", controleEndereco.alterar)
// enderecoRoutes.delete("/deletar", controleEndereco.deletar)


export { enderecoRoutes };