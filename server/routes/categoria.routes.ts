import { Router } from 'express';
import { ControleCategoria } from '../controllers/ControleCategoria';

const categoriaRoutes = Router();
const controleCategoria = new ControleCategoria();

categoriaRoutes.get('/Listar', controleCategoria.listar);
categoriaRoutes.get('/BuscarPorId/:idCategoria', controleCategoria.buscaPorId);
categoriaRoutes.post('/Adicionar', controleCategoria.adicionar);
categoriaRoutes.patch('/Alterar/:idCategoria',controleCategoria.alterar);
categoriaRoutes.delete('/Deletar',controleCategoria.deletar);

export { categoriaRoutes };