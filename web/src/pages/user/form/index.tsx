import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import { environment } from '../../../environments/environment';
import styles from './styles.module.css';
import { useToasts } from '../../../contexts/ToastContext';

function UserForm() {
  const [erro, setErro] = useState([]);
  const { isFallback } = useRouter();
  const router = useRouter();

  if (isFallback) {
    return <LoadingIcon />;
  }

  const { addToast } = useToasts();

  const registerUser = async (event) => {
    event.preventDefault();

    const pessoa = {
      body: JSON.stringify({
        nome: event.target.nome.value,
        email: event.target.email.value,
        senha: event.target.senha.value,
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
      method: "post",
    };
    await fetch(`${environment.API}/Cliente/Adicionar`, pessoa)
      .then(async (res) => {
        if (res.ok) {
          addToast({
            title: 'Cadastrado Sucedido',
            content: `Seu cadastro foi realizado com sucesso!`,
            delay: 8000,
            autohide: true,
          });
          router.push('/user/login');
        } else {
          const erro = await res.json()
          console.log(erro);

          setErro(erro);
        }
      })
  }

  return (
    <div className="pageContainer">
      <Head><title>Cadastrar-se | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div id={styles.userForm} className="pageContent">
        <h2>Cadastro do Cliente</h2>
        <div className={styles.formContainer}>
          <form onSubmit={registerUser}>
            <Container className="pb-4" fluid>
              <Row>
                <Col xs={12} sm={6}>
                  <div className={styles.email}>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="email" placeholder="Email" name="email" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "email" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.password}>
                    <label htmlFor="password"><strong>Senha</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="password" placeholder="Senha" name="senha" />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "senha" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.name}>
                    <label htmlFor="name"><strong>Nome</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Nome" name="nome" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "nome" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.identificationRg}>
                    <label htmlFor="rg"><strong>RG</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="number" placeholder="RG" name="rg" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "rg" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.identificationCpf}>
                    <label htmlFor="cpf"><strong>CPF</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="number" placeholder="CPF" name="cpf" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "cpf" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.birthDate}>
                    <label htmlFor="dataNascimento"><strong>Data de nascimento</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="date" placeholder="Data de nascimento" name="dtNasc" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "dtNasc" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={3} sm={6}>
                  <div className={styles.telephone}>
                    <label htmlFor="telephone"><strong>DDD</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="tel" name="ddd" id="" size={2} placeholder="xx" maxLength={2} minLength={2} pattern="(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "ddd" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={9} sm={6}>
                  <div className={styles.telephone}>
                    <label htmlFor="telephone"><strong>Telefone</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="tel" placeholder="xxxxxxxxx" size={9} name="numero" maxLength={9} minLength={8} pattern="(?:[2-8]|9[1-9])[0-9]{3}\[0-9]{4}$" autoComplete="off" required />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "numero" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
              </Row>
              <Row className="pt-4 d-flex justify-content-center">
                <Col xs={12} sm={6}>
                  <div className={styles.buttonsContainer}>
                    <div className={styles.create}>
                      <Button className="w-100" type="submit"><strong>Cadastrar</strong></Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </form>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
//     // const res = await fetch(`${environment.API}/Pessoa/Adicionar`, context);
//     // const response = res.json();

//     // console.log("getServerSideProps");
//     // if (res.status === 400) {
//     //     // const res = JSON.parse(res)

//     //     return {
//     //         props: { retorno: response },
//     //     }
//     // }
// return {
//     props: {
//     },
// };
// }
// export const getStaticProps: GetStaticProps = async () => {
//     const router = useRouter()
//     const { idpessoa } = router.query

//     const response = await fetch('${environment.API}/pessoa/BuscaPorId/' + idpessoa);
//     const data = await response.json();
//     return {
//         props: {
//             retorno: data,
//         }
//     }
// }


export default UserForm;