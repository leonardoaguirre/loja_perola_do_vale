import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

import styles from '../styles/components/PageHeader.module.css';

interface PageHeaderProps {

}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    const { user, logoutUser } = useContext(UserContext);

    const [search, setSearch] = useState('');

    const handleInputSearch = (event) => {
        setSearch(event.target.value);
    }

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

                <div className={styles.inputContainer}>
                    <input type="search" placeholder="Busque aqui seu produto" onChange={handleInputSearch} />
                    <button>
                        <Link href={`/productList/${search}`}>
                            <a>
                                <img src="/icons/search-black-36dp.svg" alt="Lupa" title="Buscar" />
                            </a>
                        </Link>
                    </button>
                </div>

                <div className={styles.userContainer}>
                    {user ? 
                    <Link href="/userInfo">
                        <a>
                            <img src="/icons/account_circle-black-36dp.svg" alt="Usuário" title="Minha Conta" />
                        </a>
                    </Link>
                    :
                    <Link href="/login">
                        <a>
                            <img src="/icons/account_circle-black-36dp.svg" alt="Usuário" title="Minha Conta" />
                        </a>
                    </Link>
                    }
                    

                    {user ? (
                        <div className={styles.userInfo}>
                            <strong>{user.nome}</strong>
                            <div className={styles.log}>
                                <button>
                                <Link href="/userInfo">
                                    <a>Minha Conta</a> 
                                    </Link>
                                </button>
                                <button onClick={logoutUser}>
                                    Sair
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.userInfo}>
                            <div className={styles.log}>
                                <Link href="/login">
                                    <a>
                                        Entrar
                                    </a>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>

                <div className={styles.userActions}>
                    <div className={styles.shoppingCart}>
                        <Link href="/shoppingCart">
                            <a>
                                <img src="/icons/shopping_cart-black-36dp.svg" alt="Carrinho de compras" title="Carrinho" />
                            </a>
                        </Link>
                    </div>
                    <div className={styles.favoritesItens}>
                        <Link href="/favoriteItens">
                            <a>
                                <img src="/icons/favorite_border-black-36dp.svg" alt="Coração" title="Favoritos" />
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default PageHeader;