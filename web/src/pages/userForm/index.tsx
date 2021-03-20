import { GetStaticProps } from 'next';
import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import styles from '../../styles/pages/UserForm.module.css';

function userForm({ retorno }) {
    const registerUser = async event => {
        event.preventDefault()

        const res = await fetch("http://localhost:3008/Pessoa/Adicionar", {
            body: JSON.stringify({
                nome: event.target.nome.value,
                email: event.target.email.value,
                rg: event.target.rg.value,
                cpf: event.target.cpf.value,
                dtNasc: event.target.dtNasc.value,
                telefones: [{
                    ddd: event.target.ddd.value,
                    numero: event.target.numero.value
                }]
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            }), 
            method: 'POST',
        })
        console.log(res);
        const result = await res.json();
        // result.user => 'Ada Lovelace'

        return {
            props: { retorno: result, },
        }
    }
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.userForm}>
                <h1>Cadastrar-se</h1>
                <div className={styles.formContainer}>
                    <form onSubmit={registerUser}>
                        <div className={styles.email}>
                            <label htmlFor="email">Email: </label>
                            <div className={styles.inputContainer}>
                                <input type="email" placeholder="Email" name="email" />
                            </div>
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input type="password" placeholder="Senha" name="senha" />
                            </div>
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="nome" />
                            </div>
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="RG" name="rg" />
                            </div>
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="CPF" name="cpf" />
                            </div>
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input type="date" placeholder="Data de nascimento" name="dtNasc" />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">DDD: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xx" name="ddd" />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">Telefone: </label>
                            <div className={styles.inputContainer}>
                                <input type="number" placeholder="xxxx-xxx" name="numero" />
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Cadastrar" />
                                <p>{retorno}</p>
                            </div>
                            <div className={styles.reset}>
                                <input type="reset" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <PageFooter />
        </div>
    );
}
// export const  : GetStaticProps = async () => {
//     const response = await fetch("http://localhost:3008/Pessoa/Adicionar")
//     const data = await response.json();
//     return {
//         props: {retorno: data,},
//     }


export default userForm;