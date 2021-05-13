import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import {Length } from "class-validator";

@Entity("cargo")
class Cargo {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(5, 50, { message: "A descrição deve ter entre 5 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    descricao: string;

    @CreateDateColumn()
    created_at: Date;

}

export { Cargo };