import { Router } from "express";
import { ControleVenda } from "../controllers/ControleVenda";

const vendaRoutes = Router()
const controleVenda = new ControleVenda();

vendaRoutes.post("/Adicionar", controleVenda.adicionar)
vendaRoutes.patch("/AdicionarCodRastreio", controleVenda.adicionarCodRastreio)
vendaRoutes.get("/ListarPorPessoa/:idPessoa", controleVenda.listarPorPessoa)
vendaRoutes.get("/ListarVendas", controleVenda.listarVendas)
vendaRoutes.delete("/Cancelar/:idVenda", controleVenda.cancelar)

export { vendaRoutes };