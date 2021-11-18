import Head from 'next/head';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import styles from './styles.module.css';

function TelephoneForm() {
  return (
    <div className="pageContainer">
      <Head><title>Cadastrar Telefone | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h1>Cadastrar Telefone</h1>
        <div className={styles.formContainer}>
          <form>
            <div className={styles.ddd}>
              <label htmlFor="ddd">DDD</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="XX" autoComplete="off" />
              </div>
            </div>
            <div className={styles.number}>
              <label htmlFor="telephone">Telefone</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="xxxxxxxxx" autoComplete="off" />
              </div>
            </div>
            <div className={styles.buttonsContainer}>
              <div className={styles.create}>
                <input type="submit" value="Cadastrar" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TelephoneForm;