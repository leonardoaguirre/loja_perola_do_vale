import { Router } from 'express';
import { ControleFuncionario } from '../controllers/ControleFuncionario';

const funcionarioRoutes = Router();
const controleFuncionario = new ControleFuncionario();

funcionarioRoutes.post('/Adicionar', controleFuncionario.adicionar);
funcionarioRoutes.patch('/Alterar/:idFuncionario', controleFuncionario.alterar);
funcionarioRoutes.get('/Listar', controleFuncionario.listar);
funcionarioRoutes.get('/BuscarPorId/:idFuncionario', controleFuncionario.buscarPorId);
funcionarioRoutes.delete('/Deletar', controleFuncionario.deletar);
funcionarioRoutes.get('/Buscar/:atributo/:pesquisa', controleFuncionario.buscarPor);
funcionarioRoutes.post('/Login',controleFuncionario.login);

export { funcionarioRoutes };