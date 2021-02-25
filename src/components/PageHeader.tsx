import styles from '../styles/components/PageHeader.module.css';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    return (
        <header className={styles.pageHeader}>
            <div className={styles.topBarContainer}>

                <div className={styles.logoContainter}>
                    <a href="/home">
                        <img src="icons/logo.png" alt="Logo Loja Pérola do Vale" />
                        <h1>Loja Pérola do Vale</h1>
                    </a>
                </div>

                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Busque aqui seu produto" />
                    <button>
                        <i className="fas fa-search fa-1x"></i>
                    </button>
                </div>

                <div className={styles.userContainer}>
                    <a href="/user-info">
                        <i className="far fa-user-circle fa-2x"></i>
                    </a>
                    <div className={styles.userInfo}>
                        <strong>Hideki Yamakawa</strong>
                    </div>
                </div>

                <div className={styles.userActions}>
                    <div className={styles.shoppingCart}>
                        <a href="/shopping-cart">
                            <i className="fas fa-shopping-cart fa-2x"></i>
                        </a>
                    </div>
                    <div className={styles.favoritesItens}>
                        <a href="/favorites-itens">
                            <i className="fas fa-star fa-2x"></i>
                        </a>
                    </div>
                </div>

            </div>

            <div className={styles.headerContent}>
                <div className={styles.title}>
                    <strong>{props.title}</strong>
                </div>
            </div>
        </header>
    );
}

export default PageHeader;