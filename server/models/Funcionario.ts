import { IsNumberString, Length } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { PessoaFisica } from './PessoaFisica';
import {Cargo} from './Cargo';

@Entity("funcionario")
class Funcionario{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @OneToOne(()=>PessoaFisica,{onDelete: "CASCADE", onUpdate: "CASCADE",eager: true})
    @JoinColumn({name: "id_pessoa_fisica_fk", referencedColumnName: "pessoaFisicaId"})
    pessoaFisica : PessoaFisica;

    @OneToOne(()=>Cargo,{onDelete: "NO ACTION", onUpdate: "NO ACTION",eager: true})
    @JoinColumn({name: "id_cargo_fk", referencedColumnName: "id"})
    cargo : Cargo;

    @IsNumberString({},{message : "Somente numeros sao aceitos"})
    @Length(5,7,{message: "O salario deve ter no minimo 5 no maximo 7 caracteres"})
    @Column({nullable: false, type: 'decimal', precision: 7, scale: 2 })
    salario : number;

}
export {Funcionario};