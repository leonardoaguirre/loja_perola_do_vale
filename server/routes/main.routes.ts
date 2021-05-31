import { Router } from "express";
import { pessoaRoutes } from "./pessoa.routes";
import { telefoneRoutes } from "./telefone.routes";
import { enderecoRoutes } from "./endereco.routes";
import { clienteRoutes } from "./cliente.routes";
import { cargoRoutes } from './cargo.routes';
import { funcionarioRoutes } from './funcionario.routes';
import { empresaRoutes } from './empresa.routes';
import { fornecedorRoutes } from './fornecedor.routes';
import { produtoRoutes } from './produto.routes';
import { categoriaRoutes } from './categoria.routes';
import { favoritoRoutes } from "./favorito.routes";
import { correioRoutes } from './correios.routes';

const routes = Router();

routes.use("/Pessoa", pessoaRoutes);
routes.use("/Telefone", telefoneRoutes);
routes.use("/Endereco", enderecoRoutes);
routes.use("/Cliente", clienteRoutes);
routes.use("/Funcionario", funcionarioRoutes);
routes.use("/Cargo", cargoRoutes);
routes.use("/Empresa", empresaRoutes);
routes.use("/Fornecedor", fornecedorRoutes);
routes.use("/Produto", produtoRoutes);
routes.use("/Categoria", categoriaRoutes);
routes.use("/Favorito", favoritoRoutes);
routes.use("/Correios",correioRoutes);




export { routes };