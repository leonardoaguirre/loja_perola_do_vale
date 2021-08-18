import Header from '../components/Header';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import Banner from '../components/Banner';

import styles from './styles.module.css';

export default function Home() {
  const images = ['images/1.png', 'images/2.png', 'images/3.png']

  return (
    <div className={styles.container} >
      <Header />
      <Nav />
      <div className={styles.home}>
        Promoção
        <Banner source={images} />
      </div>
      <Footer />
    </div>
  )
}