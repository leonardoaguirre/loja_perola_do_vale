import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { FiMenu } from 'react-icons/fi';

import AccountMenu from '../../../components/AccountMenu';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import OrderItem from '../../../components/OrderItem';
import PaginationBar from '../../../components/PaginationBar';
import { Order } from '../../../models/Order';
import api from '../../../services/api';
import styles from './styles.module.css';

interface PageCostumerAccountProps {
  pedidos: Order[];
  search: string;
  nPages: number;
  activePage: number;
}

const UserAccount: React.FC<PageCostumerAccountProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  return (
    <div className="pageContainer">
      <Head><title>Meus Pedidos | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <div className={styles.pageTitle}>
          <h1>Minha Conta</h1>
        </div>
        <div className={styles.content}>
          <Container className={styles.contentContainer} fluid>
            <Row>
              <Col xs={0} md={3}>
                <Offcanvas id={styles.offcanvas} show={showOffCanvas} onHide={() => setShowOffCanvas(false)}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title><h3>Minha Conta</h3></Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <AccountMenu pageSelected="orders" />
                  </Offcanvas.Body>
                </Offcanvas>
                <div className={styles.leftContent}>
                  <AccountMenu pageSelected="orders" />
                </div>
              </Col>
              <Col xs={12} md={9}>
                <div className={styles.rightContent}>
                  <header>
                    <button id={styles.offcanvasBtn} onClick={() => setShowOffCanvas(true)}><FiMenu /></button>
                    <h2>Meus Pedidos</h2>
                  </header>
                  {props.pedidos.length > 0 ?
                    props.pedidos.map((order, i) => <OrderItem order={order} key={i} />)
                    :
                    <h2>Você não possui pedidos de compra!</h2>
                  }
                </div>
              </Col>
            </Row>
            <Row className={styles.paginator}>
              <PaginationBar nPages={props.nPages} search={props.search} destination={'user/orders'} activePage={props.activePage} />
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
  const { pagina } = context.query;
  const userData = JSON.parse(user);

  let data;
  await api.get(`Venda/ListarPorPessoa/${userData.idPessoa}?pagina=${pagina}`)
    .then(res => {
      if (res.status === 200) data = res.data
      else if (res.status === 401) return { notFound: true }
    })
  // .catch(err => console.log(err))

  return {
    props: {
      pedidos: data.vendas,
      nPages: data.nPages,
      search: userData.idPessoa,
      activePage: pagina ? pagina : 1
    }
  }
}

export default UserAccount;