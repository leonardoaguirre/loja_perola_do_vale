import Link from 'next/link';

import Header from '../../../../../components/Header';
import Footer from '../../../../../components/Footer';
import ProductTable from '../../../../../components/ProductTable';

import styles from './styles.module.css';

interface ProductResultsProps {

}

const ProductResults: React.FC<ProductResultsProps> = (props) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.products}>
        <ProductTable />
        <div className={styles.actionsContainer}>
          <div className={styles.buttonContainer}>
            <Link href="/productForm">
              <button className={styles.createButton}>Cadastrar</button>
            </Link>
          </div>
          <div className={styles.buttonContainer}>
            <Link href="/updateProduct">
              <button className={styles.updateButton}>Alterar</button>
            </Link>
          </div>
          <div className={styles.buttonContainer}>
            <Link href="/deleteProduct">
              <button className={styles.deleteButton}>Excluir</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductResults;