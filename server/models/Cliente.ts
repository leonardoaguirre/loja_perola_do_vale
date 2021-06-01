import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { PessoaFisica } from './PessoaFisica';

@Entity("cliente")
class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PessoaFisica, { onDelete: "CASCADE", onUpdate: "CASCADE", eager: true })
    @JoinColumn({ name: "id_pessoa_fisica_fk", referencedColumnName: "pessoaFisicaId" })
    pessoaFisica: PessoaFisica;

}
export { Cliente };