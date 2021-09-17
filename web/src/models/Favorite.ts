import { Product } from './Product';

export class Favorite {
  id:  number;
  produto:     Product;
  favoritado:  boolean;
  nFavoritos:  number;
  created_at?: Date;
}