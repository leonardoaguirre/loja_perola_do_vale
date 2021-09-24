import { Telephone } from './Telephone';
import { PostalAdress } from './PostalAdress';

export class Pessoa {
  id: string;
  email: string;
  senha: string;
  created_at: string;
  telefones: Telephone[];
  enderecos: PostalAdress[];
}