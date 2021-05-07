import Link from 'next/link';

import styles from '../styles/components/TelephoneCardNew.module.css';

function TelephoneCardNew() {
    return (
        <div className={styles.telephoneCardNew}>
            <Link href="/telephoneForm">
                <a>
                    <div className={styles.border}>
                        <img src="/icons/add_circle_black_36dp.svg" alt="adicionar" />
                        <div>Adicionar novo telefone</div>
                    </div>
                </a>
            </Link>
        </div>
    )
}

export default TelephoneCardNew;