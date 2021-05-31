import { Router } from 'express';
import { ControleEmpresa } from '../controllers/ControleEmpresa';

const empresaRoutes = Router();
const controleEmpresa = new ControleEmpresa();

empresaRoutes.post('/Adicionar', controleEmpresa.adicionar);
empresaRoutes.patch('/Alterar/:idEmpresa', controleEmpresa.alterar);
empresaRoutes.get('/Listar', controleEmpresa.listar);
empresaRoutes.get('/BuscaPorId/:idEmpresa', controleEmpresa.buscarPorId);
empresaRoutes.delete('/Deletar', controleEmpresa.deletar);
empresaRoutes.get('/Buscar/:atributo/:pesquisa', controleEmpresa.buscarPor);

export { empresaRoutes };