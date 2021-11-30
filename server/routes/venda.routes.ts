import { Router } from "express";
import { ControleVenda } from "../controllers/ControleVenda";
import clienteAuthMiddleware from "../middlewares/clienteAuthMiddleware";

const vendaRoutes = Router()
const controleVenda = new ControleVenda();

vendaRoutes.post("/Adicionar", controleVenda.adicionar)
vendaRoutes.patch("/AdicionarCodRastreio", controleVenda.adicionarCodRastreio)
vendaRoutes.get("/ListarPorPessoa/:idPessoa", clienteAuthMiddleware, controleVenda.listarPorPessoa)
vendaRoutes.get("/ListarVendas", controleVenda.listarVendas)
vendaRoutes.get("/Pesquisar", controleVenda.pesquisarVendas)
vendaRoutes.delete("/Cancelar/:idVenda", controleVenda.cancelar)

export { vendaRoutes };