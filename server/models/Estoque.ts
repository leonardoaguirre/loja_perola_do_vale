import { IsAlphanumeric, IsDate, IsDateString, IsNumber, IsNumberString, Min } from "class-validator"
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Fornecedor } from "./Fornecedor"
import { Produto } from "./Produto"

@Entity('estoque')
class Estoque {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToMany(() => Lote, lote => lote.estoque, { eager: true } /*{ cascade: }*/)
    lotes: Lote[]

    // @IsNumberString({}, { message: 'Quantidade disponivel em estoque invalida' })
    @Min(0, { message: "Quantidade minima e 0" })
    @IsNumber({}, { message: 'Quantidade do lote invalida' })
    @Column({ nullable: false, type: 'integer' })
    quantidadeDisponivel: number

    // @IsNumberString({ no_symbols: true }, { message: 'Quantidade total invalida' })
    // @Column({ nullable: false, type: 'integer' })
    // quantidadeTotal: number

    @OneToOne(() => Produto, { cascade: false })
    @JoinColumn({ name: 'id_produto_fk', referencedColumnName: 'id' })
    produto: Produto

}

@Entity('lote')
class Lote {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsNumberString({ no_symbols: true }, { message: 'Quantidade do lote invalida' })
    // @IsNumber({}, { message: 'Quantidade do lote invalida' })
    @Column({ nullable: false, type: 'integer' })
    quantidade: number

    // @IsDateString({ strict: true }, { message: 'Data de compra invalida' })
    @IsDate({ message: "Data de compra invalida" })
    @Column({ nullable: false, type: 'date' })
    dtCompra: Date

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => Fornecedor, fornecedor => fornecedor.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', eager: true })
    @JoinColumn({ name: 'id_fornecedor_fk', referencedColumnName: 'id' })
    fornecedor: Fornecedor

    @ManyToOne(() => Estoque, estoque => estoque.lotes, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'id_estoque_fk', referencedColumnName: 'id' })
    estoque: Estoque
}

export { Estoque, Lote }