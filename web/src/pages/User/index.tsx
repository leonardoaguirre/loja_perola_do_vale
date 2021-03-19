import { GetStaticProps } from 'next';
import Link from 'next/link';

import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import ProductsTable from '../../components/ProductsTable';
import UserTable from '../../components/UserTable';

import styles from '../../styles/pages/Products.module.css';

function user({ pessoas }) {
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.products}>
                <UserTable users={pessoas}  />
                <div className={styles.actionsContainer}>
                    <div className={styles.buttonContainer}>
                        <Link href="/userForm">
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
export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch('http://localhost:3008/pessoa/listar');
    const data = await response.json();
    return {
        props: {
            pessoas: data,
        }
    }
}
export default user;