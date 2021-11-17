import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect } from 'react';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import styles from './success.module.css';

function orderSuccess() {
    return (
        <div className="pageContainer">
            <Head><title>Compra Sucedida | Ferragens Pérola do Vale</title></Head>
            <Header />
            <div id={styles.success} className="pageContent">
                <img src="/images/success-icon.png" alt="Success icon" />
                <div className={styles.rightContainer}>
                    <h1>Obrigado pela sua compra!</h1>
                    <h2>A sua compra ja foi confirmada, logo após a aprovação do pagamento enviaremos um email com mais detalhes sobre o envio de sua compra!</h2>
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

export default orderSuccess;