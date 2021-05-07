import Link from 'next/link';
import styles from '../styles/components/AccountMenu.module.css';

function AccountMenu() {
    return (
        <nav className={styles.accountMenu}>
            <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                    <Link href="/orders">
                        <a>
                            <img src="icons/box-black.svg" alt="caixa de encomenda" />
                            Pedidos
                        </a>
                    </Link>
                </li>
                <li className={styles.menuItem}>
                    <Link href="/myInfo">
                        <a>
                            <img src="icons/face_black_36dp.svg" alt="rosto de pessoa" />
                            Meus dados
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default AccountMenu;