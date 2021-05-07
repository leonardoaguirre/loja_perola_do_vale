import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Pessoa } from "./Pessoa";
import { IsNumber, IsNumberString, Length, Max, MaxLength, Min, min, MinLength } from "class-validator";

@Entity("telefone")
class Telefone {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsNumberString({ no_symbols: true }, { message: "O ddd de telefone deve conter somente numeros" })
    @Length(2, 2, { message: "O ddd de telefone deve ter 2 caracteres" })
    @Column({ nullable: false, length: 2 })
    ddd: string;

    @IsNumberString({ no_symbols: true }, { message: "O numero de telefone deve conter somente numeros" })
    @Length(8, 9, { message: "O numero de telefone deve ter 8 ou 9 caracteres" })
    @Column({ nullable: false, length: 9 })
    numero: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: false, length: 36 })
    id_pessoa_fk: String;

    @ManyToOne(() => Pessoa, pessoa => pessoa.telefones, { onDelete: "CASCADE", onUpdate: "CASCADE",})
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: "id" })
    pessoa: Pessoa;

}

export { Telefone };