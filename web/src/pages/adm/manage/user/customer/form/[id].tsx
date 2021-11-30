import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Footer from '../../../../../../components/Footer';
import Header from '../../../../../../components/Header';
import LoadingIcon from '../../../../../../components/LoadingIcon';
import { environment } from '../../../../../../environments/environment';
import styles from './styles.module.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Costumer } from '../../../../../../models/Costumer';
import { useToasts } from '../../../../../../contexts/ToastContext';

interface PageCostumerInfoProps {
  costumer: Costumer;
}


const UserAlterForm: React.FC<PageCostumerInfoProps> = (props) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { addToast } = useToasts();

  const [email, setEmail] = useState<string>(props.costumer?.pessoaFisica.pessoa.email);
  const [nome, setNome] = useState<string>(props.costumer?.pessoaFisica.nome);
  const [rg, setRg] = useState<string>(props.costumer?.pessoaFisica.rg);
  const [cpf, setCpf] = useState<string>(props.costumer?.pessoaFisica.cpf);
  const [dtnasc, setDtnasc] = useState<string>(props.costumer?.pessoaFisica.dtNasc);

  const [erro, setErro] = useState([]);

  const router = useRouter();

  const registerUser = async (event) => {
    event.preventDefault();

    if (props.costumer?.id) {
      await fetch(`${environment.API}/Cliente/Alterar/${props.costumer?.id}`, {
        body: JSON.stringify({
          nome: nome,
          email: email,
          rg: rg,
          cpf: cpf,
          dtNasc: dtnasc
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }),
        method: "PATCH",
      }).then(async (res) => {
        if (res.ok) {
          addToast({
            title: 'Cliente alterado',
            content: `O cliente ${nome} foi alterado com sucesso!`,
            delay: 8000,
            autohide: true,
          });
          setErro([]);
          router.push('/adm/manage/user/customer/search');
        } else {
          const erro = await res.json()
          console.log(erro);

          setErro(erro);
        }
      })
    }
  }

  return (
    <div className="pageContainer">
      <Head><title>Alerar Cliente | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div id={styles.userForm} className="pageContent">
        <h2>Alterar Cliente</h2>
        <div className={styles.formContainer}>
          <form onSubmit={registerUser}>
            <Container className="pb-4" fluid>
              <Row>
                <Col xs={12} sm={6}>
                  <div className={styles.email}>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        defaultValue={email}
                        onChange={event => setEmail(event.target.value)}
                        autoComplete="off"
                        disabled
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "email" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.password}>
                    <label htmlFor="password"><strong>Senha</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="password"
                        placeholder="Senha"
                        name="senha"
                        defaultValue="***********"
                        autoComplete="off"
                        disabled
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "senha" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.name}>
                    <label htmlFor="name"><strong>Nome</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        defaultValue={nome}
                        onChange={event => setNome(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "nome" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.identificationRg}>
                    <label htmlFor="rg"><strong>RG</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="number"
                        placeholder="RG"
                        name="rg"
                        defaultValue={rg}
                        onChange={event => setRg(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "rg" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.identificationCpf}>
                    <label htmlFor="cpf"><strong>CPF</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="number"
                        placeholder="CPF"
                        name="cpf"
                        defaultValue={cpf}
                        onChange={event => setCpf(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "cpf" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className={styles.birthDate}>
                    <label htmlFor="dataNascimento"><strong>Data de nascimento</strong></label>
                    <div className={styles.inputContainer}>
                      <input
                        type="date"
                        placeholder="Data de nascimento"
                        name="dtNasc"
                        defaultValue={dtnasc}
                        onChange={event => setDtnasc(event.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    {erro.length > 0 ? erro.map((err) => err.property === "dtNasc" ? Object.values(err.constraints).map((tipoErro, key) => <p key={key}>{tipoErro}</p>) : "") : ""}
                  </div>
                </Col>
              </Row>
              <Row className="pt-4 d-flex justify-content-center">
                <Col xs={12} sm={6}>
                  <div className={styles.buttonsContainer}>
                    <div className={styles.create}>
                      <Button className="w-100" type="submit"><strong>Alterar</strong></Button>
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
// export const getStaticPaths: GetStaticPaths = async (context) => {

//     // const { tokenCookie } = context.req.cookies;

//     // const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

//     // const response = await fetch(`${environment.API}/Cliente/Listar`,pessoa);
//     // const data = await response.json();

//     // const paths = data.map(pessoa => {
//     //     return { params: { id: '' } }
//     // });

//     const paths = [{ params: { id: '' } }]
//     return {
//         paths,
//         fallback: true
//     }

// }
// export const getStaticProps: GetStaticProps = async (context) => {
//     const { id } = context.params;


//     const response = await fetch(`${environment.API}/Cliente/BuscaPorId/${id}`);
//     const data = await response.json();

//     return {
//         props: {
//             retorno: data,
//         }
//     }
// }
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;

  const response = await fetch(`${environment.API}/cliente/BuscaPorId/${id}`);
  const data = await response.json();

  console.log(data)

  return {
    props: {
      costumer: data,
    }
  }
}

export default UserAlterForm;