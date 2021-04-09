import Link from 'next/link';

import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import ProductsTable from '../../components/ProductsTable';

import styles from '../../styles/pages/Products.module.css';

function products() {
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.products}>  
                <ProductsTable />
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
            <PageFooter />
        </div>
    );
}

export default products;