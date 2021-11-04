import Link from 'next/link';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

import styles from './success.module.css';
import { useContext, useEffect } from 'react';
import { StepperContext } from '../../../contexts/StepperContext';

function orderSuccess() {
    const { currentStep, setCurrentStepNumber } = useContext(StepperContext);

    useEffect(() => {
        setCurrentStepNumber(3);
    }, [])

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.success}>
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