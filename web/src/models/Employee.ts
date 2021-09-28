import { PessoaFisica } from './PessoaFisica';
import { Cargo } from './Cargo';

export class Employee {
  id: string;
  salario: string;
  pessoaFisica: PessoaFisica;
  cargo: Cargo;
}