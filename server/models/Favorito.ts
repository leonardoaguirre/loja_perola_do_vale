import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { } from 'class-validator';
import { Produto } from './Produto';

@Entity("favorito")
class Favorito {
    @PrimaryGeneratedColumn("increment")
    id: Int32Array;

    @OneToOne(() => Pessoa, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: 'id' })
    pessoa: Pessoa;

    @OneToOne(() => Produto, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "id_produto_fk", referencedColumnName: 'id' })
    produto: Produto

    @CreateDateColumn()
    created_at: Date;
}
export { Favorito };