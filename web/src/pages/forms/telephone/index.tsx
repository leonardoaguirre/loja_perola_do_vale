import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

import styles from './styles.module.css';

function TelephoneForm() {
  return (
    <div className="pageContainer">
      <Header />
      <div className={styles.userForm}>
        <h1>Cadastrando novo número de telefone</h1>
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