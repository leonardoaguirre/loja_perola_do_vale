import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNumber, Length } from 'class-validator';
import { Produto } from './Produto';

@Entity("imagem")
class Imagem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Length(4, 100, { message: "Nome original da imagem deve ter entre 4 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    originalName: string;

    @Length(4, 100, { message: "mimetype da imagem deve ter entre 4 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    mimetype: string;

    @Length(4, 100, { message: "destination da imagem deve ter entre 4 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    destination: string;

    @Length(4, 100, { message: "filename da imagem deve ter entre 4 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    filename: string;

    @Length(4, 100, { message: "Path da imagem deve ter entre 4 e 100 caracteres" })
    @Column({ nullable: false, length: 100 })
    path: string;

    @IsNumber({ allowInfinity: true }, { message: "O tamanho deve ser do tipo numero" })
    @Column({ nullable: false})
    size: number;

    @ManyToOne(() => Produto, produto => produto.imagens, { onDelete: "CASCADE", onUpdate: "CASCADE", })
    @JoinColumn({ name: "id_produto_fk", referencedColumnName: "id" })
    produto: Produto;

    @CreateDateColumn()
    created_at : Date;

    @UpdateDateColumn()
    updated_at: Date;
}
export { Imagem };