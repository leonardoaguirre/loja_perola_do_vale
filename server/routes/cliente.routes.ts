import { Router } from 'express';
import { ControleCliente } from '../controllers/ControleCliente';

const clienteRoutes = Router();
const controleCliente = new ControleCliente();

clienteRoutes.get('/Listar',controleCliente.listar);
clienteRoutes.post('/Adicionar',controleCliente.adicionar);
clienteRoutes.patch('/Alterar/:id',controleCliente.alterar);
clienteRoutes.delete('/Deletar',controleCliente.deletar);
clienteRoutes.get('/Buscar/:atributo/:pesquisa',controleCliente.buscar);


export{clienteRoutes};