import Link from 'next/link';
import Image from 'next/image';

import styles from '../styles/components/PageHeaderAdministration.module.css';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

interface PageHeaderAdministrationProps {

}

const PageHeaderAdministration: React.FC<PageHeaderAdministrationProps> = (props) => {
    const { user, logoutUser } = useContext(UserContext);

    return (
        <header className={styles.pageHeader}>
            <div className={styles.topBarContainer}>

                <div className={styles.logoContainter}>
                    <Link href="/">
                        <a>
                            <img id={styles.logoImg} src="/icons/logo.png" alt="Logo Ferragens Pérola do Vale" title="Logo Ferragens Pérola do Vale" />
                            <img id={styles.logoTitle} src="/icons/ferragens-perola-do-vale-preto.png" alt="Logo título Ferragens Pérola do Vale" title="Logo título Ferragens Pérola do Vale" />
                        </a>
                    </Link>
                </div>

                <div className={styles.userContainer}>
                    <Link href="/user/userInfo">
                        <a>
                            <img src="/icons/account_circle-black-36dp.svg" alt="Usuário" title="Minha Conta" />
                        </a>
                    </Link>

                    {user ? (
                        <div className={styles.userInfo}>
                            <strong>{user.nome}</strong>
                            <span>Gerente</span>
                        </div>
                    ) : (
                        <div className={styles.userInfo}>
                            <strong>Funcionario não localizado</strong>
                            <span>(cargo)</span>+
                        </div>
                    )
                    }

                </div>

                <div className={styles.userActions}>
                    <Link href="/storage">
                        <div className={styles.storage}>
                            <a>
                                <img src="/icons/boxes-black.svg" alt="Caixas" title="Estoque" />
                            </a>
                        </div>
                    </Link>
                    <Link href="/manageEmployees">
                        <div className={styles.manageEmployees}>
                            <a>
                                <img src="/icons/manage_accounts-black-36dp.svg" alt="Usuário com uma engrenagem" title="Gerenciar Funcionários" />
                            </a>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default PageHeaderAdministration;