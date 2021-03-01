import PageHeader from '../components/PageHeader';

import Head from 'next/head';

import styles from '../styles/pages/Home.module.css';
import PageFooter from '../components/PageFooter';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Início | Loja Pérola do Vale</title>
      </Head>
      <PageHeader />
      <PageFooter />
    </div>
  )
}