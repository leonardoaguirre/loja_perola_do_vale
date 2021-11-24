import { IsDecimal, IsNumberString, Length, Matches, } from "class-validator";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Endereco } from "./Endereco";
import { Pessoa } from "./Pessoa";
import { Produto } from "./Produto";

enum Status {
    EM_APROVACAO = "Em andamento...",
    COMPRA_APROVADA = "Compra aprovada",
    PEDIDO_ENVIADO = "Pedido enviado",
    PEDIDO_CANCELADO = "Pedido cancelado",
    PEDIDO_FINALIZADO = "Pedido concluido"
}

@Entity("venda")
class Venda {
    @PrimaryGeneratedColumn("increment")
    id: string;

    @Column({ type: 'enum', enum: Status, default: Status.COMPRA_APROVADA })
    status: Status

    // @IsDecimal({ decimal_digits: '1,2', force_decimal: true }, { message: "Subtotal é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    subtotal: number;

    // @IsDecimal({ decimal_digits: '1,2', force_decimal: true , }, { message: "Valor de frete é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    valorFrete: number;

    // @IsDecimal({ decimal_digits: '1,2', force_decimal: false }, { message: "Valor total é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    valorTotal: number;

    // @Matches(/^[A-Z]{2}[1-9]{9}[A-Z]{2}$/, { message: 'Codigo de rastreio invalido!' })
    @Length(0, 13, { message: "A codigo de rastreio deve ter 13 caracteres" })
    @Column({ length: 13, nullable: true })
    codRastreio: string;

    @CreateDateColumn()
    dtCompra: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => FormaPagamento, forma => forma.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: "id_pagamento_fk", referencedColumnName: 'id' })
    formaPagamento: FormaPagamento

    @ManyToOne(() => Endereco, endereco => endereco.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: "id_endereco_fk", referencedColumnName: 'id' })
    destino: Endereco;

    @ManyToOne(() => Pessoa, pessoa => pessoa.enderecos, { onDelete: "NO ACTION", onUpdate: "NO ACTION" , eager : false})
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: "id" })
    pessoa: Pessoa;

    @OneToMany(() => ItemVenda, itemVenda => itemVenda.venda, { eager: true })
    itensVenda: ItemVenda[]
}

@Entity("itemvenda")
class ItemVenda {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Produto, produto => produto.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , eager :true})
    @JoinColumn({ name: "id_produto_fk", referencedColumnName: "id" })
    produto: Produto

    @IsDecimal({ decimal_digits: '1,2', force_decimal: true }, { message: "Valor unitario é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    valorUnit: number;

    @IsDecimal({ decimal_digits: '1,2', force_decimal: true }, { message: "Valor subtotal é invalido(centavos separado com ponto(.)" })
    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
    valorSubTotal: number;

    @IsNumberString({ no_symbols: true }, { message: "Quantidade invalida" })
    @Column({ nullable: false })
    quantidade: number;

    @ManyToOne(() => Venda, venda => venda.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    venda?: Venda;
}

@Entity("formapagamento")
class FormaPagamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @IsDateString({strict :true}, { message: 'Data invalida' })
    // @IsDate({})
    @CreateDateColumn({})
    @Column({ type: 'date' })
    dtVencimento: Date;

    @Length(7, 50, { message: "O nome deve ter entre 7 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    nomeTitular: string;
}

export { Venda, FormaPagamento, ItemVenda, Status };