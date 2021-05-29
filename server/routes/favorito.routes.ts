import { Router } from 'express';
import { ControleFavorito } from '../controllers/ControleFavorito';

const controleFavorito = new ControleFavorito();
const favoritoRoutes = Router();

favoritoRoutes.get('/Listar', controleFavorito.listar);
favoritoRoutes.post('/Adicionar', controleFavorito.adicionar);
favoritoRoutes.get('/ListarPorPessoa/:idPessoa', controleFavorito.listarPorPessoa);
favoritoRoutes.delete('/Deletar', controleFavorito.deletar);

export { favoritoRoutes };