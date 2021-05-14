import Link from 'next/link';

import styles from '../styles/components/PostalAdressCardNew.module.css';

function PostalAdressCardNew() {
    return (
        <div className={styles.postalAdressCardNew}>
            <Link href="/telephoneForm">
                <a>
                    <div title="Adicionar endereço">
                        <img className={styles.homeIcon} src="/icons/home_black_36dp.svg" alt="casa" />
                        <img className={styles.addIcon} src="/icons/add_circle_black_36dp.svg" alt="adicionar" />
                    </div>
                    <div>Adicionar novo endereço</div>
                </a>
            </Link>
        </div>
    )
}

export default PostalAdressCardNew;