import Link from 'next/link';

import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from './404.module.css';

function Error404() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.error404}>
        <img src="/images/sad_face.png" alt="Sad face emoji" />
        <div className={styles.rightContainer}>
          <h1>Erro 404!</h1>
          <h2>Ops, a página que você pesquisou não existe ou já expirou...</h2>
          <br />
          <Link href="/">
            <a>Voltar para a página inícial <img src="/icons/double_arrow_blue_36dp.png" alt="seta dupla" /></a>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Error404;