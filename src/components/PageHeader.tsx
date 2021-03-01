import Link from 'next/link';

import styles from '../styles/components/PageHeader.module.css';

interface PageHeaderProps {

}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    return (
        <header className={styles.pageHeader}>
            <div className={styles.topBarContainer}>

                <div className={styles.logoContainter}>
                    <Link href="/">
                        <a>
                            <img id={styles.logoImg} src="icons/logo.png" alt="Logo Ferragens Pérola do Vale" />
                            <img id={styles.logoTitle} src="icons/logoTitle.png" alt="Logo título Ferragens Pérola do Vale"/>
                        </a>
                    </Link>
                </div>

                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Busque aqui seu produto" />
                    <button>
                        <i className="fas fa-search fa-1x"></i>
                    </button>
                </div>

                <div className={styles.userContainer}>
                    <Link href="/userInfo">
                        <a>
                            <i className="far fa-user-circle fa-2x"></i>
                        </a>
                    </Link>
                    <div className={styles.userInfo}>
                        <strong>Hideki Yamakawa</strong>
                    </div>
                </div>

                <div className={styles.userActions}>
                    <div className={styles.shoppingCart}>
                        <Link href="/shoppingCart">
                            <a>
                                <i className="fas fa-shopping-cart fa-2x"></i>
                            </a>
                        </Link>
                    </div>
                    <div className={styles.favoritesItens}>
                        <Link href="/favoriteItens">
                            <a>
                                <i className="fas fa-star fa-2x"></i>
                            </a>
                        </Link>
                    </div>
                </div>

            </div>

            <div className={styles.headerContent}>
                <div className={styles.menu}>
                    <i className="fas fa-bars fa-2x"></i>
                    <span>Departamentos</span>
                </div>
            </div>
        </header>
    );
}

export default PageHeader;