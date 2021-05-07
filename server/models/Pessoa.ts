import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Telefone } from "./Telefone";
import { Endereco } from "./Endereco";
import { Length, IsEmail, IsDateString, IsNumberString } from "class-validator";
import { Encrypt } from "../services/encrypt";

@Entity("pessoa")
class Pessoa {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Length(10, 100, { message: "O email deve ter entre 10 e 100 caracteres" })
  @IsEmail({}, { message: "Email invalido!" })
  @Column({ nullable: false, length: 100, unique: true })
  email: string;

  @Length(60, 60, { message: "Hash de senha não está do tamanho correto" })
  @Column({ nullable: false })
  senha: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Telefone, telefone => telefone.pessoa, { eager: true })
  telefones: Telefone[];

  @OneToMany(() => Endereco, endereco => endereco.pessoa, { eager: true })
  enderecos: Endereco[];
}


export { Pessoa };