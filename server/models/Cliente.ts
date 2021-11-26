import { Length } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { PessoaFisica } from './PessoaFisica';

@Entity("cliente")
class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Length(0, 50, { message: "O apelido deve ter no maximo 50 caracteres" })
    // @Column({ nullable: true, length: 50 })
    // apelido : String
    
    @OneToOne(() => PessoaFisica, { onDelete: "CASCADE", onUpdate: "CASCADE", eager: true })
    @JoinColumn({ name: "id_pessoa_fisica_fk", referencedColumnName: "pessoaFisicaId" })
    pessoaFisica: PessoaFisica;

}
export { Cliente };