import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import {IsString, Length } from "class-validator";
import { Produto } from "./Produto";

@Entity("categoria")
class Categoria {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(4, 50, { message: "A descrição deve ter entre 4 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    descricao: string;

    @ManyToMany(()=>Produto,produto=>produto.categorias,{onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    produtos : Produto[];

    @CreateDateColumn()
    created_at: Date;

}

export { Categoria };