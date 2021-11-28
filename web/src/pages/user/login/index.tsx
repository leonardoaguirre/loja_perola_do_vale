import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import { UserContext } from '../../../contexts/UserContext';
import api from '../../../services/api';
import styles from './styles.module.css';

interface LoginProps {
  cameFrom: string;
}

const Login: React.FC<LoginProps> = (props) => {
  const { loginUser } = useContext(UserContext);
  const router = useRouter();
  const { isFallback } = useRouter();

  if (isFallback) {
    return <LoadingIcon />;
  }

  const [error, setError] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const passwordEl = useRef();

  const login = async (event) => {
    event.preventDefault();

    const authentication = {
      email: event.target.email.value,
      senha: event.target.password.value
    }

    api.post('Cliente/Login', authentication)
      .then((res) => {
        console.log(res);
        if (res.statusText == 'OK') {
          loginUser(res.data.pessoa, res.data.token);
          if (props.cameFrom == null || props.cameFrom == `${process.env.URL}/user/login`) {
            router.push('/');
          } else {
            router.push(props.cameFrom);
          }
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

  const toggleShow = () => {
    if (passwordEl) {
      // @ts-ignore
      if (passwordEl.current.type == 'password') {
        // @ts-ignore
        passwordEl.current.type = 'text';
        setShow(true);
      } else {
        // @ts-ignore
        passwordEl.current.type = 'password';
        setShow(false);
      }
    }
  }

  useEffect(() => {
    console.log(props.cameFrom);
  }, [])

  return (
    <div className="pageContainer entire-page fx-column align-i-center">
      <Head><title>Login | Ferragens Pérola do Vale</title></Head>
      <Header headerType="login" />
      <form id={styles.login} onSubmit={login}>
        <div className={styles.header}>
          <h1>Login do cliente</h1>
        </div>
        <div className={styles.email}>
          <label htmlFor="email"><strong>Email</strong></label>
          <input type="email" name="email" autoComplete="off" placeholder="exemplo@email.com" />
        </div>
        <div className={styles.password}>
          <label htmlFor="password"><strong>Senha</strong></label>
          <div className={styles.passwordInput}>
            <input ref={passwordEl} type="password" name="password" autoComplete="off" placeholder="senha" />
            <button type="button" onClick={toggleShow}>
              {(show) ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </button>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.errorMessage}>
            {error == "" ? "" : <p>{error}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit" variant="primary"><strong>Continuar</strong></Button>
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
  const referer: string = context.req.headers.referer ? context.req.headers.referer : null;

  if (tokenCookie !== undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      cameFrom: referer,
    }
  }
}

export default Login;