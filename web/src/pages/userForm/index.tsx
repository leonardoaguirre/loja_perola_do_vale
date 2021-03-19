import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import styles from '../../styles/pages/UserForm.module.css';

function userForm() {
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.userForm}>
                <h1>Cadastrar-se</h1>
                <div className={styles.formContainer}>
                    <form>
                        <div className={styles.email}>
                            <label htmlFor="email">Email: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Email" />
                            </div>
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Senha: </label>
                            <div className={styles.inputContainer}>
                                <input type="password" placeholder="Senha" />
                            </div>
                        </div>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" />
                            </div>
                        </div>
                        <div className={styles.identificationRg}>
                            <label htmlFor="rg">RG: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="RG" />
                            </div>
                        </div>
                        <div className={styles.identificationCpf}>
                            <label htmlFor="cpf">CPF: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="CPF" />
                            </div>
                        </div>
                        <div className={styles.birthDate}>
                            <label htmlFor="dataNascimento">Data de nascimento: </label>
                            <div className={styles.inputContainer}>
                                <input type="date" placeholder="Data de nascimento" />
                            </div>
                        </div>
                        <div className={styles.telephone}>
                            <label htmlFor="telephone">Telefone: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="(XX) xxxx-xxx" />
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Cadastrar" />
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

export default userForm;