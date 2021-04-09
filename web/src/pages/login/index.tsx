import Link from 'next/link';

import styles from '../../styles/pages/Login.module.css';

function Login() {
    return (
        <div className={styles.container}>
            <form action="">
                <div className={styles.header}>
                    <img src="/icons/logo.png" alt="Logo ferragens pérola do vale" />
                    <h1>Entrar</h1>
                </div>
                <div className={styles.email}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="exemplo@email.com" />
                </div>
                <div className={styles.password}>
                    <label htmlFor="password">Senha</label>
                    <input type="password" name="password" placeholder="senha" />
                </div>

                <div className={styles.errorMessage}>
                    <p>Email ou senha inválidos</p>
                </div>

                <div className={styles.actionsContainer}>
                    <div className={styles.buttonContainer}>
                        <input type="submit" value="Entrar" />
                    </div>
                    <div className={styles.passwordForgotten}>
                        <Link href="/esquecisenha">
                            <a>Esqueci minha senha</a>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;