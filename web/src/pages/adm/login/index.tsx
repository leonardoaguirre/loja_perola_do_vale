import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import LoadingIcon from '../../../components/LoadingIcon';
import { UserContext } from '../../../contexts/UserContext';
import { environment } from '../../../environments/environment';
import api from '../../../services/api';
import styles from './styles.module.css';

interface LoginProps {
  
}

const Login: React.FC<LoginProps> = (props) =>  {
  const { loginUser } = useContext(UserContext);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { isFallback } = useRouter();

  if (isFallback) {
    return <LoadingIcon />;
  }

  const login = async (event) => {
    event.preventDefault();

    const authentication = {
      email: event.target.email.value,
      senha: event.target.password.value
    }

    api.post('Funcionario/Login', authentication)
      .then((res) => {
        console.log(res);
        if (res.statusText == 'OK') {
          loginUser(res.data.pessoa, res.data.token);
          router.push('/');
        }
      })
      .catch((error) => {
        if (error.response) {
          // request feita e servidor respondeu
          // setError(error.response.data.constraints.message)
          setError("Email ou senha inválidos");
        } else if (error.request) {
          // request feita, mas sem resposta
          setError("Servidor fora do ar!");
        } else {
          // algo falhou
          setError("Descupe, algo deu errado!");
        }
      })
  }
  
  return (
    <div className="pageContainer entire-page">
      <form id={styles.login} onSubmit={login}>
        <div className={styles.header}>
          <img src="/icons/logo.png" alt="Logo ferragens pérola do vale" />
          <h1>Login de Funcionario</h1>
        </div>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="exemplo@email.com" />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Senha</label>
          <input type="password" name="password" placeholder="senha" />
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.errorMessage}>
            {error == "" ? "" : <p>{error}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit">Entrar</button>
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
export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tokenCookie } = context.req.cookies;
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