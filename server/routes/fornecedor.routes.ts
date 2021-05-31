import { Router } from 'express';
import { ControleFornecedor } from '../controllers/ControleFornecedor';

const fornecedorRoutes = Router();
const controleFornecedor = new ControleFornecedor();

fornecedorRoutes.post('/Adicionar', controleFornecedor.adicionar);
fornecedorRoutes.patch('/Alterar/:idFornecedor', controleFornecedor.alterar);
fornecedorRoutes.get('/Listar', controleFornecedor.listar);
fornecedorRoutes.get('/BuscarPorId/:idFornecedor', controleFornecedor.buscarPorId);
fornecedorRoutes.delete('/Deletar', controleFornecedor.deletar);
fornecedorRoutes.get('/Buscar/:atributo/:pesquisa', controleFornecedor.buscarPor);

export { fornecedorRoutes };