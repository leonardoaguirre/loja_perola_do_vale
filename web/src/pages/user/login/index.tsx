import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import LoadingIcon from '../../../components/LoadingIcon';
import { UserContext } from '../../../contexts/UserContext';
import { environment } from '../../../environments/environment';

import styles from './styles.module.css';

interface LoginProps {
  
}

const Login: React.FC<LoginProps> = (props) => {
  const { loginUser } = useContext(UserContext);
  const [erro, setErro] = useState({ constraints: { message: "" } });
  const router = useRouter();
  const { isFallback } = useRouter();

  if (isFallback) {
    return <LoadingIcon />;
  }

  const login = async (event) => {
    event.preventDefault();

    const pessoa = {
      body: JSON.stringify({
        email: event.target.email.value,
        senha: event.target.password.value,
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: "post",
    };
    await fetch(`${environment.API}/Cliente/Login`, pessoa)
      .then(async (res) => {
        if (res.ok) {
          const r = await res.json();

          loginUser(r.pessoa, r.token);
          router.push('/');
        } else {
          const err = await res.json()

          setErro(err);
        }
      })
  }
  return (
    <div className={styles.container}>
      <form onSubmit={login}>
        <div className={styles.header}>
          <img src="/icons/logo.png" alt="Logo ferragens pérola do vale" />
          <h1>Entrar</h1>
        </div>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" autoComplete="off" placeholder="exemplo@email.com" />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Senha</label>
          <input type="password" name="password" autoComplete="off" placeholder="senha" />
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.errorMessage}>
            {erro.constraints.message == "" ? "" : <p>{erro.constraints.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit">Entrar</button>
          </div>
          <div className={styles.passwordForgotten}>
            <Link href="/esquecisenha">
              <a>Esqueci minha senha</a>
            </Link>
          </div>
          <div className={styles.register}>
            <p>Não possui uma conta?</p>
            <span>
              <Link href="/user/form">
                <a>Cadastre-se</a>
              </Link>
            </span>
          </div>
          <div className={styles.employeeLogin}>
            <p>Você é nosso colaborador?</p>
            <span>
              <Link href="/adm/login">
                <a>Entre por aqui!</a>
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tokenCookie } = context.req.cookies;
  console.log(tokenCookie);

  if (tokenCookie !== undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {}
  }
}

export default Login;