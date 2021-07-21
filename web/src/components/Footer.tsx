import styles from '../styles/components/Footer.module.css';
import Logo from './Logo';
import Link from 'next/link';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBarContainer}>
        <Logo color="white" />
        <div className={styles.linksContainer}>
          <div className={styles.mapLocation}>
            <Link href="https://goo.gl/maps/ekkeZRJEX39yGkFA8">
              <a target="_blank">
                <img src="/icons/google-maps-white.svg" alt="logo do google maps" title="Google Maps" />
              </a>
            </Link>
          </div>
          <div className={styles.socialMedias}>
            <Link href="https://www.facebook.com/pages/Ferragens%20Perola%20do%20Vale/383000095476541/">
              <a target="_blank">
                <img src="/icons/facebook-white.svg" alt="logo do facebook" title="Facebook" />
              </a>
            </Link>
            <Link href="http://www.instagram.com">
              <a target="_blank">
                <img src="/icons/instagram-white.svg" alt="logo do instagram" title="Instagram" />
              </a>
            </Link>
            <Link href="http://www.twitter.com">
              <a target="_blank">
                <img src="/icons/twitter-white.svg" alt="logo do twitter" title="Twitter" />
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.footerContent}>
        <p>Grupo 5 / CNPJ: 00.000.000/0000-00 / Iscrição Estadual: 00.000.00-0 / R. Dona Laurinda, 16 -
          Centro, Guararema - SP, 08900-000 / +55 (11) 4693-1340</p>
      </div>
    </footer>
  );
}

export default Footer;