import { Router } from 'express';
import { ControleCliente } from '../controllers/ControleCliente';
import clienteAuthMiddleware from '../middlewares/clienteAuthMiddleware';
import gerenteAuthMiddleware from '../middlewares/gerenteAuthMiddleware';

const clienteRoutes = Router();
const controleCliente = new ControleCliente();

clienteRoutes.get('/Listar',gerenteAuthMiddleware,controleCliente.listar);
clienteRoutes.post('/Adicionar',controleCliente.adicionar);
clienteRoutes.patch('/Alterar/:idCliente',controleCliente.alterar);
clienteRoutes.delete('/Deletar',controleCliente.deletar);
clienteRoutes.post('/Login',controleCliente.login);
clienteRoutes.get('/Buscar/:atributo/:pesquisa',controleCliente.buscar);
clienteRoutes.get('/BuscaPorId/:idCliente',controleCliente.buscarPorId);


export{clienteRoutes};