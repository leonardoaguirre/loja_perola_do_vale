import styles from '../styles/components/TelephoneCard.module.css';

interface Telephone {
    ddd: string;
    numero: string;
}

interface TelephoneCardProps {
    telephone: Telephone;
    index: number;
}

const TelephoneCard: React.FC<TelephoneCardProps> = (props) => {
    return (
        <div className={styles.telephoneCard}>
            <header>
                <div className={styles.telephoneTitle}>
                    <strong>Opção {props.index+1}</strong>
                </div>
                <div className={styles.telephoneActions}>
                    <button>
                        <img src="/icons/edit_white_36dp.svg" alt="lápis" title="editar" />
                    </button>
                    <button>
                        <img src="/icons/delete_white_36dp.svg" alt="lixeira" title="excluir" />
                    </button>
                </div>
            </header>
            <div className={styles.content}>
                <div className={styles.dddNumber}>
                    <label htmlFor="ddd">DDD</label>
                    <input type="text" name="ddd" value={props.telephone.ddd} disabled />
                </div>
                <div className={styles.telephoneNumber}>
                    <label htmlFor="number">Número</label>
                    <input type="text" name="number" value={props.telephone.numero} disabled />
                </div>
            </div>
        </div>
    )
}

export default TelephoneCard;