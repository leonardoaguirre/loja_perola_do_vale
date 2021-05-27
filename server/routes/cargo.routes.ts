import {Router} from 'express';
import {ControleCargo} from '../controllers/ControleCargo';

const cargoRoutes= Router();
const controleCargo = new ControleCargo();

cargoRoutes.get('/Listar', controleCargo.listar);
cargoRoutes.post('/Adicionar',controleCargo.adicionar);
cargoRoutes.patch('/Alterar/:idCargo',controleCargo.alterar);
cargoRoutes.delete('/Deletar',controleCargo.deletar);
cargoRoutes.get('/BuscaPorId/:idCargo',controleCargo.buscaPorId)

export {cargoRoutes};