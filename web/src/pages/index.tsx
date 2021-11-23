import Head from 'next/head';

import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Nav from '../components/Nav';

export default function Home() {
  const images = ['images/1.png', 'images/2.png', 'images/3.png'];

  return (
    <div className="pageContainer">
      <Head><title>Ferragens Pérola do Vale</title></Head>
      <Header />
      <Nav />
      <div className="pageContent">
        <h1>Promoção</h1>
        <Banner source={images} />
      </div>
      <Footer />
    </div>
  )
}