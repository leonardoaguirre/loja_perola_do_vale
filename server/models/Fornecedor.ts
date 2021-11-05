import {PessoaJuridica} from './PessoaJuridica';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity("fornecedor")
class Fornecedor{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @OneToOne(()=>PessoaJuridica,{onDelete : "CASCADE", onUpdate : "CASCADE", eager : true})
    @JoinColumn({name : "id_pessoa_juridica_fk", referencedColumnName: "pessoaJuridicaId"})
    pessoaJuridica : PessoaJuridica;

    @Length(7, 50, { message: "O nome do representante deve ter entre 7 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    representante : String
}
export{Fornecedor};