import {Router} from 'express';
import { ControleImgs } from '../controllers/ControleImgs';
import { ControleProduto } from '../controllers/ControleProduto';
import {upload} from '../uploads/uploadImgs'


const produtoRoutes = Router();
const controleProduto = new ControleProduto();
const controleImgs = new ControleImgs();


produtoRoutes.get('/Listar',controleProduto.listar);
produtoRoutes.get('/Procurar/:pesquisa',controleProduto.procurar);
produtoRoutes.get('/BuscarPorId/:idProduto',controleProduto.buscarPorId);
produtoRoutes.post('/Adicionar',upload.array('images',5),controleProduto.adicionar);
produtoRoutes.patch('/Alterar/:idProduto',upload.array('images',5),controleProduto.alterar);
produtoRoutes.delete('/Deletar',controleProduto.deletar);
produtoRoutes.post('/Teste',upload.array("images",5),controleImgs.teste);

export{produtoRoutes};