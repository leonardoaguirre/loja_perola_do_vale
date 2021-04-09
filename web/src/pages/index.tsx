import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import SubHeader from '../components/SubHeader';

import Head from 'next/head';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Início | Ferragens Pérola do Vale</title>
      </Head>
      <PageHeader />
      <SubHeader />
      <div className={styles.home}>
        
      </div>
      <PageFooter />
    </div>
  )
}