import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import {Length } from "class-validator";

@Entity("categoria")
class Categoria {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(4, 50, { message: "A descrição deve ter entre 4 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    descricao: string;

    @CreateDateColumn()
    created_at: Date;

}

export { Categoria };