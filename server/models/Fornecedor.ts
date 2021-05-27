import {PessoaJuridica} from './PessoaJuridica';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("fornecedor")
class Fornecedor{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @OneToOne(()=>PessoaJuridica,{onDelete : "CASCADE", onUpdate : "CASCADE", eager : true})
    @JoinColumn({name : "id_pessoa_juridica_fk", referencedColumnName: "pessoaJuridicaId"})
    pessoaJuridica : PessoaJuridica;

}
export{Fornecedor};