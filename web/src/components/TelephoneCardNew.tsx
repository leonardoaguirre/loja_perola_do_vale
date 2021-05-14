import Link from 'next/link';

import styles from '../styles/components/TelephoneCardNew.module.css';

function TelephoneCardNew() {
    return (
        <div className={styles.telephoneCardNew}>
            <Link href="/telephoneForm">
                <a>
                    <div className={styles.border}>
                        <div title="Adicionar telefone">
                            <img className={styles.telephoneIcon} src="/icons/phone_black_36dp.svg" alt="telefone" />
                            <img className={styles.addIcon} src="/icons/add_circle_black_36dp.svg" alt="adicionar" />
                        </div>
                        <div>Adicionar novo telefone</div>
                    </div>
                </a>
            </Link>
        </div>
    )
}

export default TelephoneCardNew;