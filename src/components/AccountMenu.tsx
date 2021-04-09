import Link from 'next/link';
import styles from '../styles/components/AccountMenu.module.css';

function AccountMenu() {
    return (
        <div className={styles.accountMenu}>
            <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                    <Link href="/orders">
                        <a>
                            <img src="icons/box-black.svg" alt="caixa de encomenda" />
                            Pedidos
                        </a>
                    </Link>
                </li>
                <li className={styles.menuItem}>Cadastro</li>
                <li className={styles.menuItem}>Endereço</li>
                <li className={styles.menuItem}>Telefone</li>
                <li className={styles.menuItem}>Avaliações</li>
            </ul>
        </div>
    );
}

export default AccountMenu;