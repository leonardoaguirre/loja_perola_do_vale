import { Router } from 'express';
import {correiosServices} from '../services/correios'

const correioRoutes = Router();
const correio = new correiosServices();

correioRoutes.get('/ConsultaCep/:cep',correio.consultaCep);
correioRoutes.post('/CalculaFrete',correio.calculaFrete);
// correioRoutes.post('/Adicionar',controleCliente.adicionar);
// correioRoutes.patch('/Alterar/:id',controleCliente.alterar);
// correioRoutes.delete('/Deletar',controleCliente.deletar);

// correioRoutes.get('/BuscaPorId',controleCliente.buscarPorId);


export{correioRoutes};