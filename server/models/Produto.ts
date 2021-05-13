import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Telefone } from "./Telefone";
import { Endereco } from "./Endereco";
import { Length, IsEmail, IsDateString, IsNumberString } from "class-validator";
import { Encrypt } from "../services/encrypt";

@Entity("produto")
class Produto {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Length(10, 100, { message: "O email deve ter entre 10 e 100 caracteres" })
  @Column({ nullable: false, length: 100, unique: true })
  nome: string;

  @Length(10, 100, { message: "O email deve ter entre 10 e 100 caracteres" })
  @Column({ nullable: false, length: 100, unique: true })
  marca: string;

//   @Length(60, 60, { message: "Hash de senha não está do tamanho correto" })
//   @Column({ nullable: false })
//   senha: string;

  @CreateDateColumn()
  created_at: Date;

//   @OneToMany(() => Telefone, telefone => telefone.Produto, { eager: true })
//   telefones: Telefone[];

//   @OneToMany(() => Endereco, endereco => endereco.Produto, { eager: true })
//   enderecos: Endereco[];
}


export { Produto };