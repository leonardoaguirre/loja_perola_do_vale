import { Router } from 'express'
import { ControleEstoque } from '../controllers/ControleEstoque'

const estoqueRoutes = Router()
const controleEstoque = new ControleEstoque()

estoqueRoutes.post('/AdicionarLote', controleEstoque.adicionarLoteAoEstoque)
// estoqueRoutes.patch('/AlterarLote', controleEstoque.alterarLoteAoEstoque)
// estoqueRoutes.get('/Listar',controleEstoque.listar)
estoqueRoutes.get('/ListarLotes/:idEstoque',controleEstoque.listarLotes)
estoqueRoutes.get('/ProcurarPorProduto/:idProd',controleEstoque.procurarEstoque)
estoqueRoutes.delete('/RemoverLote',controleEstoque.removerLote)

export { estoqueRoutes }