import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pessoa } from "./Pessoa";
import { IsNumber, Length, Max, Min } from "class-validator";

@Entity("endereco")
class Endereco {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(8,8,{message:"O cep deve ter 8 numeros"})
    @Column({length:8})
    cep: string;

    @Length(5,50,{message:"O nome da rua deve ter entre 5 e 50 caracteres"})
    @Column({length:50})
    rua: string;

    @IsNumber()
    @Min(1,{message:"O numero deve ter ao menos 1 caracter"})
    @Max(9999,{message:"O numero deve ter no maximo 4 caracteres"})
    @Column({})
    numero: number;

    @Length(4,50,{message:"O bairro deve ter entre 4 e 50 caracteres"})
    @Column({length:50})
    bairro: string

    @Length(3,50,{message:"A cidade deve ter entre 3 e 50 caracteres"})
    @Column({length:50})
    cidade: string;

    @Length(2,2,{message:"A sigla de estado deve ter 2 caracteres"})
    @Column({length:2})
    estado: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Pessoa, pessoa => pessoa.enderecos,{onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: "id" })
    pessoa: Pessoa;
}

export { Endereco };