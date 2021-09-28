import { Router } from "express";
import { ControleVenda } from "../controllers/ControleVenda";

const vendaRoutes = Router()
const controleVenda = new ControleVenda();

vendaRoutes.post("/Adicionar",controleVenda.adicionar)

export {vendaRoutes};