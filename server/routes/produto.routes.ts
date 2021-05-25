import {Router} from 'express';
import { ControleImgs } from '../controllers/ControleImgs';
import { ControleProduto } from '../controllers/ControleProduto';
import {upload} from '../uploads/uploadImgs'


const produtoRoutes = Router();
const controleProduto = new ControleProduto();
const controleImgs = new ControleImgs();


produtoRoutes.get('/Listar',controleProduto.listar);
produtoRoutes.post('/Adicionar',upload.array('images',5),controleProduto.adicionar);
produtoRoutes.delete('/Deletar',controleProduto.deletar);
produtoRoutes.post('/Teste',upload.array("images",5),controleImgs.teste);

export{produtoRoutes};