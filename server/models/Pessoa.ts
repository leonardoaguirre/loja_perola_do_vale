import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Telefone } from "./Telefone";
import { Endereco } from "./Endereco";
import { Length, IsEmail, IsDateString, IsNumberString } from "class-validator";
<<<<<<< HEAD
import { Encrypt } from "../services/encrypt";
=======
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

@Entity("pessoa")
class Pessoa {
  @PrimaryGeneratedColumn("uuid")
  id: string;

<<<<<<< HEAD
  @Length(7, 50, { message: "O nome deve ter entre 7 e 50 caracteres" })
  @Column({ nullable: false, length: 50 })
  nome: string;

  @IsNumberString({ no_symbols: true }, { message: "O rg deve conter somente numeros" })
  @Length(9, 9, { message: "O rg deve ter 9 caracteres" })
  @Column({ nullable: false, length: 9, unique: true, })
  rg: string;

  @IsNumberString({ no_symbols: true }, { message: "O cpf deve conter somente numeros" })
  @Length(11, 11, { message: "O cpf deve ter 11 caracteres" })
  @Column({ nullable: false, length: 11, unique: true })
  cpf: string;

  @IsDateString({ strict: true }, { message: "A data precisa ser valida" },)
  @Column({ type: 'date', nullable: false })
  dtNasc: Date;

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
=======
  @Length(7,50,{message:"O nome deve ter entre 7 e 50 caracteres"})
  @Column({ nullable: false, length: 50 })
  nome: string;

  @IsNumberString({no_symbols:true},{message:"O rg deve conter somente numeros"})
  @Length(9,9,{message:"O rg deve ter 9 caracteres"})
  @Column({ nullable: false, length: 9, unique: true,  })
  rg: string;

  @IsNumberString({no_symbols:true},{message:"O cpf deve conter somente numeros"})
  @Length(11,11,{message:"O cpf deve ter 11 caracteres"})
  @Column({ nullable: false, length: 11, unique: true })
  cpf: string;

  @IsDateString({strict:true},{message:"A data precisa ser valida"},)
  @Column({type :'date', nullable: false })
  dtNasc : Date;

  @Length(10,100,{message:"O email deve ter entre 10 e 100 caracteres"})
  @IsEmail({}, {message:"Email invalido!"})
  @Column({ nullable: false, length: 100, unique:true})
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Telefone, telefone => telefone.pessoa, {eager : true})
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
  telefones: Telefone[];

  @OneToMany(() => Endereco, endereco => endereco.pessoa, { eager: true })
  enderecos: Endereco[];
<<<<<<< HEAD

=======
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")
}

export { Pessoa };