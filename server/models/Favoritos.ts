import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Pessoa} from './Pessoa';
import {} from 'class-validator';

@Entity("favoritos")
class Favoritos {
    @PrimaryGeneratedColumn("increment")
    id : Int32Array;

    // @Column({nullable : false})
    // id_pessoa_fk : String;

    @OneToOne(()=> Pessoa)
    @JoinColumn({})
    pessoa : Pessoa;

    @CreateDateColumn()
    created_at : Date;
}
export{Favoritos};