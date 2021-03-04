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
                            <img id={styles.logoImg} src="icons/logo.png" alt="Logo Ferragens Pérola do Vale" title="Logo Ferragens Pérola do Vale" />
                            <img id={styles.logoTitle} src="icons/logoTitle.png" alt="Logo título Ferragens Pérola do Vale" title="Logo título Ferragens Pérola do Vale" />
                        </a>
                    </Link>
                </div>

                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Busque aqui seu produto" />
                    <button>
                        <Link href="/products">
                            <a>
                                <img src="icons/search-black-36dp.svg" alt="Lupa" title="Buscar" />
                            </a>
                        </Link>
                    </button>
                </div>

                <div className={styles.userContainer}>
                    <Link href="/userInfo">
                        <a>
                            <img src="icons/account_circle-black-36dp.svg" alt="Usuário" title="Minha Conta" />
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
                                <img src="icons/shopping_cart-black-36dp.svg" alt="Carrinho de compras" title="Carrinho" />
                            </a>
                        </Link>
                    </div>
                    <div className={styles.favoritesItens}>
                        <Link href="/favoriteItens">
                            <a>
                                <img src="icons/favorite_border-black-36dp.svg" alt="Coração" title="Favoritos" />
                            </a>
                        </Link>
                    </div>
                </div>

            </div>

            <div className={styles.headerContent}>
                <div className={styles.menu}>
                    <div className={styles.departmentsDropdown}>
                        <button className={styles.dropdownButton}>
                            <img src="icons/menu-black-36dp.svg" alt="3 barras horizontais empilhadas" title="Menu" />
                            <strong>Departamentos</strong>
                            <img src="icons/keyboard_arrow_down-black-36dp.svg" className={styles.arrowAnimation} alt="seta para baixo" />
                        </button>
                        <div className={`${styles.dropdownContent} ${styles.barBlock} ${styles.border}`}>
                            <a href="#" className={`${styles.menuBarIten} ${styles.menuButton}`}>Eletrônicos</a>
                            <a href="#" className={`${styles.menuBarIten} ${styles.menuButton}`}>Ferramentas</a>
                            <a href="#" className={`${styles.menuBarIten} ${styles.menuButton}`}>Materiais</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default PageHeader;