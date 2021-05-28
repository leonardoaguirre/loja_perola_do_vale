import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Length, IsDecimal, IsNumberString, IsEmpty } from "class-validator";
import { Categoria } from "./Categoria";
import { Imagem } from "./Imagem";

@Entity("produto")
class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(5, 100, { message: "O nome deve ter entre 5 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    nome: string;

    @Length(5, 100, { message: "A marca deve ter entre 5 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    marca: string;

    @Length(10, 65000, { message: "A descricao deve ter entre no minimo 10 caracteres", })
    @Column({ nullable: false, type: 'text' })
    descricao: string;

    @IsDecimal({ decimal_digits: '1,2', force_decimal: true }, { message: "Valor de venda é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    valorVenda: number;

    @Length(12, 13, { message: "O codigo de barra deve conter no minimo 12 e no maximo 13 numeros" })
    @IsNumberString({ no_symbols: true }, { message: "Codigo de barra invalido" })
    @Column({ nullable: false , length : 13})
    codBarra: string;

    @IsNumberString({ no_symbols: true }, { message: "Quantidade invalida" })
    @Column({ nullable: false })
    quantidade: number;

    @IsDecimal({ decimal_digits: '1,3', force_decimal: true }, { message: "Peso é invalido" })
    @Column({ nullable: false, type: 'decimal', precision: 3, scale: 3 })
    peso: number;

    @IsNumberString({ no_symbols: true }, { message: "Altura invalida, valor somente em centimetros" })
    @Column({ nullable: false })
    altura: number;

    @IsNumberString({ no_symbols: true }, { message: "Largura invalida, valor somente em centimetros" })
    @Column({ nullable: false })
    largura: number;

    @IsNumberString({ no_symbols: true }, { message: "Comprimento invalido, valor somente em centimetros" })
    @Column({ nullable: false })
    comprimento: number;

    @IsEmpty({message : "O produto deve conter pelos menos 1 imagem"})
    @OneToMany(() => Imagem, imagem => imagem.produto, { eager: true })
    imagens: Imagem[];

    @ManyToMany(() => Categoria, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({ name: 'produto_categoria', })
    categorias: Categoria[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
export { Produto };