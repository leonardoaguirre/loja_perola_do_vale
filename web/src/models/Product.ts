import { Image } from "./Image";
import { Category } from './Category';

export class Product {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  valorVenda: string;
  codigoBarra: string;
  quantidade?: number;
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  imagens: Image[];
  categorias: Category[];
}