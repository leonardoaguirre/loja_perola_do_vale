import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import SubHeader from '../components/SubHeader';
import Banner from '../components/Banner';
import Head from 'next/head';
import styles from '../styles/pages/Home.module.css';
import * as dotenv from 'dotenv';
import { useEffect } from 'react';
import LoadingIcon from '../components/LoadingIcon';
import { Button } from 'react-bootstrap';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Home() {
    //dotenv.config({path : "../.env.local"});
    const images = ['images/1.png', 'images/2.png', 'images/3.png']

    return (
        <div className={styles.container} >
            <Head>
                <title>Início | Ferragens Pérola do Vale</title>
            </Head>
            <Header />
            <Navigation />
            <div className={styles.home}>
                Promoção
                <Banner source={images} />
                <Button variant="primary">Primary</Button>{' '}
            </div>
            <Footer />
        </div>
    )
}