import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import styles from './styles.module.css';

interface OrderSuccessProps {
  userId: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  userId
}) => {
  return (
    <div className="pageContainer">
      <Head><title>Compra Sucedida | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <div id={styles.success}>
          <div className={styles.content}>
            <div className={styles.svgContainer}>
              <BsCheckCircleFill />
            </div>
            <div className={styles.right}>
              <h1>Obrigado pela sua compra!</h1>
              <p>A sua compra ja foi confirmada, logo após a aprovação do pagamento enviaremos um email com mais detalhes sobre o envio de sua compra!</p>
              <Link href={`/user/orders/${userId}`}>
                <a>
                  <Button id={styles.backToBuy} variant="primary"><IoIosArrowBack />Ver Meus Pedidos</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.req.cookies;
  const userData = JSON.parse(user);

  return {
    props: {
      userId: userData.id,
    }
  }
}

export default OrderSuccess;