import Link from 'next/link';

import styles from '../styles/components/SubHeader.module.css';

function SubHeader() {
    return (
        <nav className={styles.productNavigation}>
            <div className={styles.productNavigationContent}>
                <div className={styles.menu}>
                    <div className={styles.menuItens}>
                        <div className={styles.departmentsDropdown}>
                            <button className={styles.dropdownButton}>
                                <img src="/icons/menu-black-36dp.svg" alt="3 barras horizontais empilhadas" title="Menu" />
                                <strong>Departamentos</strong>
                                <img src="/icons/keyboard_arrow_down-black-36dp.svg" className={styles.arrowAnimation} alt="seta para baixo" />
                            </button>
                            <div className={`${styles.dropdownContent} ${styles.barBlock} ${styles.border}`}>
                                <Link href="#">
                                    <a className={`${styles.menuBarIten} ${styles.menuButton}`}>Eletrônicos</a>
                                </Link>
                                <Link href="#">
                                    <a className={`${styles.menuBarIten} ${styles.menuButton}`}>Ferramentas</a>
                                </Link>
                                <Link href="#">
                                    <a className={`${styles.menuBarIten} ${styles.menuButton}`}>Materiais</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={styles.menuItens}>
                        <button className={styles.selected}>
                            Todos{'\u00A0'}Produtos
                        </button>
                    </div>
                    <div className={styles.menuItens}>
                        <button>
                            Promoções
                        </button>
                    </div>
                    <div className={styles.menuItens}>
                        <button>
                            Ferramentas
                        </button>
                    </div>
                    <div className={styles.menuItens}>
                        <button>
                            Materiais
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default SubHeader;