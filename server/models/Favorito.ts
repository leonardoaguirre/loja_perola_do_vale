import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { } from 'class-validator';
import { Produto } from './Produto';

@Entity("favorito")
class Favorito {
    @PrimaryGeneratedColumn("increment")
    id: Int32Array;

    @ManyToOne(() => Pessoa, pessoa => pessoa.id, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: 'id' })
    pessoa: Pessoa;

    @ManyToOne(() => Produto, produto => produto.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "id_produto_fk", referencedColumnName: 'id' })
    produto: Produto

    @CreateDateColumn()
    created_at: Date;
}
export { Favorito };