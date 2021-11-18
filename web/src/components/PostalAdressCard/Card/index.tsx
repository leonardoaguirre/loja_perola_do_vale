import { FaPen, FaTrash } from 'react-icons/fa';

import { Adress } from '../../../models/Costumer';
import styles from './styles.module.css';

interface PostalAdressCardProps {
  postalAdress: Adress;
  selectable?: boolean;
  selected?: boolean;
}

const PostalAdressCard: React.FC<PostalAdressCardProps> = ({
  postalAdress,
  selectable,
  selected,
}) => {
  return (
    <div className={selectable ? selected ? `${styles.postalAdress} ${styles.selectable} ${styles.selected}` : `${styles.postalAdress} ${styles.selectable}` : styles.postalAdress}>
      <header>
        <div className={styles.postalAdressTitle}>
          <strong>{postalAdress.titulo}</strong>
        </div>
        <div className={styles.postalAdressActions}>
          <button title="editar">
            <FaPen />
          </button>
          <button title="excluir">
            <FaTrash />
          </button>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.adress}>
          <div>{`${postalAdress.rua}, ${postalAdress.numero}`}</div>
        </div>
        <div className={styles.complementAndDistrict}>
          <div>{`${postalAdress.complemento} | ${postalAdress.bairro}`}</div>
        </div>
        <div className={styles.location}>
          <div>{`${postalAdress.cidade}, ${postalAdress.estado} - ${postalAdress.cep}`}</div>
        </div>
      </div>
    </div>
  )
}

export default PostalAdressCard;