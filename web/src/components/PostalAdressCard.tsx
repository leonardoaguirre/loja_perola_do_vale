import { useState, useEffect, ChangeEvent } from 'react';
import styles from '../styles/components/PostalAdressCard.module.css';

interface PostalAdress {
    id: string;
    titulo?: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

interface PostalAdressCardProps {
    postalAdress: PostalAdress;
    index: number;
}

const PostalAdressCard: React.FC<PostalAdressCardProps> = (props) => {

    const [inputSize,  setInputSize] = useState(0);

    function resizeInput() {
        //setInputSize(inputSize);
    }

    useEffect(() => {
        resizeInput();
    }, []);

    return (
        <div className={styles.postalAdress}>
            <header>
                <div className={styles.postalAdressTitle}>
                    <strong>{props.postalAdress.titulo}</strong>
                </div>
                <div className={styles.postalAdressActions}>
                    <button>
                        <img src="/icons/edit_white_36dp.svg" alt="lápis" title="editar" />
                    </button>
                    <button>
                        <img src="/icons/delete_white_36dp.svg" alt="lixeira" title="excluir" />
                    </button>
                </div>
            </header>
            <div className={styles.content}>
                <div className={styles.adress}>
                    <div>{`${props.postalAdress.rua}, nº ${props.postalAdress.numero}`}</div>
                </div>
                <div className={styles.complementAndDistrict}>
                    <div>{`${props.postalAdress.complemento} | ${props.postalAdress.bairro}`}</div>
                </div>
                <div className={styles.location}>
                    <div>{`${props.postalAdress.cidade}, ${props.postalAdress.estado} - ${props.postalAdress.cep}`}</div>
                </div>
            </div>
        </div>
    )
}

export default PostalAdressCard;