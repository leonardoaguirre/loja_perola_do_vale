import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import SubHeader from '../components/SubHeader';
import Banner from '../components/Banner';
import Head from 'next/head';
import styles from '../styles/pages/Home.module.css';
import * as dotenv from 'dotenv';

export default function Home() {
  //dotenv.config({path : "../.env.local"});
  const images = ['images/1.png', 'images/2.jpg', 'images/3.jpg']

  return (
    <div className={styles.container} >
      <Head>
        <title>Início | Ferragens Pérola do Vale</title>
      </Head>
      <PageHeader />
      <SubHeader />
      <div className={styles.home}>
        Promoção
        <Banner source={images}/>
      </div>
      <PageFooter />
    </div>
  )
}