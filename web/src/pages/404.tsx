import Head from 'next/head';
import Link from 'next/link';
import { FaRegSadCry } from 'react-icons/fa';

import Footer from '../components/Footer';
import Header from '../components/Header';
import styles from './404.module.css';
import { Button } from 'react-bootstrap';
import { IoIosArrowBack } from 'react-icons/io';

function Error404() {
  return (
    <div className="pageContainer">
      <Head><title>Erro 404 | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <div id={styles.error404}>
          <div className={styles.content}>
            <FaRegSadCry />
            <div className={styles.right}>
              <h2>Ops, a página que você pesquisou não existe ou já expirou...</h2>
              <Link href={'/'}>
                <a>
                  <Button id={styles.backToBuy} variant="primary"><IoIosArrowBack />Voltar à página inicial</Button>
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

export default Error404;