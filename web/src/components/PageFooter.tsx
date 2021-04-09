import Link from 'next/link';

import styles from '../styles/components/PageFooter.module.css';

function PageFooter() {
    return (
        <footer className={styles.pageFooter}>
            <div className={styles.topBarContainer}>
                <div className={styles.logoContainter}>
                    <Link href="/">
                        <a>
                            <img id={styles.logoImg} src="/icons/logo.png" alt="Logo Ferragens Pérola do Vale" title="Logo Ferragens Pérola do Vale"/>
                            <img id={styles.logoTitle}  src="/icons/ferragens-perola-do-vale-branco.png" alt="Logo título Ferragens Pérola do Vale" title="Logo título Ferragens Pérola do Vale"/>
                        </a>
                    </Link>
                </div>
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
                <h5>Grupo 5 / CNPJ: 00.000.000/0000-00 / Iscrição Estadual: 00.000.00-0 / R. Dona Laurinda, 16 -
                    Centro, Guararema - SP, 08900-000 / +55 (11) 4693-1340</h5>
            </div>
        </footer>
    )
}

export default PageFooter;