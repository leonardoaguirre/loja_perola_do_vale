import { Router } from "express";
import { ControleEndereco } from "../controllers/ControleEndereco";

const enderecoRoutes = Router();
const controleEndereco = new ControleEndereco();


enderecoRoutes.post("/Adicionar", controleEndereco.adicionar);
// enderecoRoutes.get("/listar", controleEndereco.listar);
enderecoRoutes.get("/ListarPorId/:idPessoa", controleEndereco.listarPorId);
enderecoRoutes.patch("/Alterar/:idEndereco", controleEndereco.alterar)
enderecoRoutes.delete("/Deletar", controleEndereco.deletar)


export { enderecoRoutes };