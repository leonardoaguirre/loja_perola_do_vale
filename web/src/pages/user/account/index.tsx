import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { FiMenu } from 'react-icons/fi';

import AccountMenu from '../../../components/AccountMenu';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import PostalAdressCard from '../../../components/PostalAdressCard/Card';
import PostalAdressCardNew from '../../../components/PostalAdressCard/New';
import TelephoneCard from '../../../components/TelephoneCard/Card';
import TelephoneCardNew from '../../../components/TelephoneCard/New';
import { useToasts } from '../../../contexts/ToastContext';
import { environment } from '../../../environments/environment';
import { Costumer } from '../../../models/Costumer';
import api from '../../../services/api';
import styles from './styles.module.css';

interface PageCostumerAccountProps {
  costumer: Costumer
}

interface Erro {
  constraints: {};
  property: string;
}

const UserAccount: React.FC<PageCostumerAccountProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const router = useRouter();
  const { add } = useToasts();

  const [nome, setNome] = useState<string>(props.costumer?.pessoaFisica.nome);
  const [cpf, setCpf] = useState<string>(props.costumer?.pessoaFisica.cpf);
  const [rg, setRg] = useState<string>(props.costumer?.pessoaFisica.rg);
  const [dtnasc, setDtnasc] = useState<string>(props.costumer?.pessoaFisica.dtNasc);

  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  const [show, setShow] = useState(false);

  const [erro, setErro] = useState<Erro[]>([]);

  useEffect(() => {
    if (nome != props.costumer?.pessoaFisica.nome ||
      cpf != props.costumer?.pessoaFisica.cpf ||
      rg != props.costumer?.pessoaFisica.rg ||
      dtnasc != props.costumer?.pessoaFisica.dtNasc) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [nome, cpf, rg, dtnasc])

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const cliente = {
      body: JSON.stringify({
        nome: nome,
        dtNasc: dtnasc,
        cpf: cpf,
        rg: rg
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: "PATCH",
    };

    const response = await fetch(`${environment.API}/Cliente/Alterar/${props.costumer.id}`, cliente)

    const result = await response.json();

    if (response.ok) {
      router.reload();
      add({
        title: 'Usuário Alterado',
        content: `Seus dados foram alterados com sucesso!`,
        delay: 8000,
        autohide: true,
      });
      setErro([]);
    } else {
      // setErro(result);
      const alerta = result.map(err => Object.values(err.constraints).map((tipoErro, key) => { return tipoErro }));
      alert(alerta)
      {/* {erro.length>0 ? erro.map((err)=> err.property === "nome" ? Object.values(err.constraints).map((tipoErro,key)=> <p key={key}>{tipoErro}</p>) : "") : ""} */ }

    }
  }

  return (
    <div className="pageContainer">
      <Head><title>Minha Conta | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <div className={styles.pageTitle}>
          <h1>Minha Conta</h1>
        </div>
        <div className={styles.content}>
          <Container fluid>
            <Row>
              <Col xs={0} md={3}>
                <Offcanvas id={styles.offcanvas} show={show} onHide={() => setShow(false)}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title><h3>Minha Conta</h3></Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <AccountMenu pageSelected="datas" user={props.costumer.pessoaFisica.pessoa.id} />
                  </Offcanvas.Body>
                </Offcanvas>
                <div className={styles.leftContent} >
                  <AccountMenu pageSelected="datas" user={props.costumer.pessoaFisica.pessoa.id} />
                </div>
              </Col>
              <Col xs={12} md={9}>
                <div className={styles.rightContent}>
                  <header>
                    <button id={styles.offcanvasBtn} onClick={() => setShow(true)}><FiMenu /></button>
                    <h2>Meus Dados</h2>
                  </header>
                  <div className={styles.formContainer}>
                    <form id={styles.userForm} onSubmit={handleSubmitForm}>
                      <Container fluid className={styles.userData}>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="name"><strong>Nome</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="text"
                                name="nome"
                                autoComplete="off"
                                defaultValue={props.costumer?.pessoaFisica.nome}
                                onChange={event => setNome(event.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="rg"><strong>RG</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="number"
                                name="rg" autoComplete="off"
                                defaultValue={props.costumer?.pessoaFisica.rg}
                                onChange={event => setRg(event.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="cpf"><strong>CPF</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="number"
                                name="cpf"
                                autoComplete="off"
                                defaultValue={props.costumer?.pessoaFisica.cpf}
                                onChange={event => setCpf(event.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="dataNascimento"><strong>Data de<br />nascimento</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="date"
                                name="dtNasc"
                                autoComplete="off"
                                defaultValue={props.costumer?.pessoaFisica.dtNasc}
                                onChange={event => setDtnasc(event.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="email"><strong>Email</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={props.costumer?.pessoaFisica.pessoa.email}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className={styles.row}>
                          <Col xs={3} sm={3} className={styles.labelCol}>
                            <label htmlFor="password"><strong>Senha</strong></label>
                          </Col>
                          <Col xs={9} sm={9} className={styles.inputCol}>
                            <div className={styles.inputContainer}>
                              <input
                                type="password"
                                name="senha"
                                autoComplete="off"
                                value="***********"
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={4} sm={3}></Col>
                          <Col xs={8} sm={9}>
                            <div className={styles.actions}>
                              <Button type="submit" variant="primary" disabled={disabledBtn}><strong>Alterar</strong></Button>
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </form>
                    <h3>Telefones</h3>
                    <form id={styles.telephoneForm}>
                      <Container>
                        <Row>
                          {props.costumer?.pessoaFisica.pessoa.telefones.length > 0
                            ? props.costumer?.pessoaFisica.pessoa.telefones.map((telephone, index) => {
                              return <Col xs={6} sm={4} md={6} lg={4} key={index} ><div className={styles.telephoneCard}><TelephoneCard telephone={telephone} index={index} /></div></Col>
                            })
                            : ''}
                          {props.costumer?.pessoaFisica.pessoa.telefones.length < 3
                            ? <Col xs={6} sm={4} md={6} lg={4}><div className={styles.telephoneCard}><TelephoneCardNew /></div></Col>
                            : ''}
                        </Row>
                      </Container>
                    </form>
                    <h3>Endereços</h3>
                    <form id={styles.postalAdressForm}>
                      <Container fluid>
                        <Row>
                          {props.costumer?.pessoaFisica.pessoa.enderecos.length > 0
                            ? props.costumer?.pessoaFisica.pessoa.enderecos.map((endereco, index) => {
                              return <Col xs={12} sm={6} key={index}><div className={styles.postalCard} ><PostalAdressCard postalAdress={endereco} /></div></Col>
                            })
                            : ''}
                          {props.costumer?.pessoaFisica.pessoa.enderecos.length < 3
                            ? <Col xs={12} sm={6}><div className={styles.postalCard}><PostalAdressCardNew /></div></Col>
                            : ''}
                        </Row>
                      </Container>
                    </form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.req.cookies;

  if (user) {
    const userData = JSON.parse(user);

    let data = null;
    await api.get(`Cliente/BuscaPorId/${userData.id}`)
      .then(res => data = res.data)
      .catch(err => console.log(err))

    if (!data) return { notFound: true }

    return {
      props: {
        costumer: data,
      }
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default UserAccount;