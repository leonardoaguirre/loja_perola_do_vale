interface FavoriteProps {
  favorite: Favorite;
  products: Product[];
}

interface Favorite {
  id: number;
  pessoa: string;
  produto: string;
  created_at: string;
}

interface Product {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  valorVenda: number;
  codigoBarra: string;
  quantidade: number;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  imagens: Image[];
  categorias: Category[];
}

interface Image {
  id: string;
  originalName: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

interface Category {
  id: string;
  descricao: string;
}

const FavoriteList: React.FC<FavoriteProps> = (props) => {
  return (
    <>
    </>
  );
}

export default FavoriteList;