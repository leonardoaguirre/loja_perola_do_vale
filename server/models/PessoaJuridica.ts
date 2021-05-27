import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumberString, Length } from 'class-validator';
import {Pessoa} from './Pessoa';

@Entity("pessoajuridica")
class PessoaJuridica{
    @PrimaryGeneratedColumn('uuid')
    pessoaJuridicaId : string;

    @IsNumberString({ no_symbols: true }, { message: "O cnpj deve conter somente numeros" })
    @Length(14, 14, { message: "O cpf deve ter 14 caracteres" })
    @Column({ nullable: false, length: 14, unique: true })
    cnpj: string;

    @Length(7, 50, { message: "O nome fantasia deve ter entre 7 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    nomeFantasia: string;

    @OneToOne(()=>Pessoa,{onDelete: "CASCADE", onUpdate: "CASCADE",eager : true})
    @JoinColumn({name: "id_pessoa_fk", referencedColumnName: "id"})
    pessoa : Pessoa;
}
export {PessoaJuridica};