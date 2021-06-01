import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { Pessoa } from './Pessoa';
import { IsDateString, IsNumberString, Length } from 'class-validator';

@Entity("pessoafisica")
class PessoaFisica {

    @PrimaryGeneratedColumn('uuid')
    pessoaFisicaId: string;

    @Length(7, 50, { message: "O nome deve ter entre 7 e 50 caracteres" })
    @Column({ nullable: false, length: 50 })
    nome: string;

    @IsNumberString({ no_symbols: true }, { message: "O rg deve conter somente numeros" })
    @Length(9, 9, { message: "O rg deve ter 9 caracteres" })
    @Column({ nullable: false, length: 9})
    rg: string;

    @IsNumberString({ no_symbols: true }, { message: "O cpf deve conter somente numeros" })
    @Length(11, 11, { message: "O cpf deve ter 11 caracteres" })
    @Column({ nullable: false, length: 11})
    cpf: string;

    @IsDateString({ strict: true }, { message: "A data precisa ser valida" },)
    @Column({ type: 'date', nullable: false })
    dtNasc: Date;

    @OneToOne(() => Pessoa, { onDelete: "CASCADE", onUpdate: "CASCADE", eager: true })
    @JoinColumn({ name: "id_pessoa_fk", referencedColumnName: "id" })
    pessoa: Pessoa;

}
export { PessoaFisica };