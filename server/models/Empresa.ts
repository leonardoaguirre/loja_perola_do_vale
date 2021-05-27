import {PessoaJuridica} from './PessoaJuridica';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("empresa")
class Empresa{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @OneToOne(()=>PessoaJuridica,{onDelete : "CASCADE", onUpdate : "CASCADE", eager : true})
    @JoinColumn({name : "id_pessoa_juridica_fk", referencedColumnName: "pessoaJuridicaId"})
    pessoaJuridica : PessoaJuridica;

}
export{Empresa};