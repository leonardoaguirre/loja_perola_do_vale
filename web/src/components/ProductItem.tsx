import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/components/ProductItem.module.css';
import { toString } from 'lodash';

interface ProductItemProps {
    product: Product;
    index: number;
}

interface Product {
    id: string;
    nome: string;
    marca: string;
    descricao: string;
    valorVenda: number;
    codigoBarra: string;
    quantidade: number;
    peso: number;
    altura: number;
    largura: number;
    comprimento: number;
    imagens: Image[];
    categorias: Category[];
}

interface Image {
    id: string;
    originalName: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

interface Category {
    id: string;
    descricao: string;
}


const ProductItem: React.FC<ProductItemProps> = (props) => {

    const [hasDiscount, setHasDiscount] = useState(false);

    return (
        <li key={props.index} className={styles.item}>
            <Link href={`/productSearch/${props.product.id}`}>
                <a>
                    <div className={styles.itemContainer}>
                        <header>
                            {hasDiscount
                                ? <div className={styles.discount}>-10%</div>
                                : ''}
                        </header>
                        {hasDiscount
                            ? <div className={`${styles.content} ${styles.hasDiscount}`}>
                                <figure>
                                    <img src={props.product.imagens[0].path} alt={props.product.nome} />
                                </figure>
                                <h2>{props.product.nome.length > 93
                                    ? `${props.product.nome.slice(0, 93)}...`
                                    : props.product.nome}
                                </h2>
                                <div className={styles.price}>
                                    <strong className={styles.oldPrice}><span>R$</span>{(props.product.valorVenda * 1.1).toFixed(2)}</strong>
                                    <strong className={styles.currentPrice}><span>R$</span>{parseFloat(toString(props.product.valorVenda)).toFixed(2)}</strong>
                                    <span className={styles.installment}>10x de R$ {`${(props.product.valorVenda / 10).toFixed(2)} sem juros`}</span>
                                </div>
                            </div>
                            : <div className={styles.content}>
                                <figure>
                                    <img src={`http://localhost:3008/${props.product.imagens[0].path}`} alt={props.product.nome} />
                                </figure>
                                <h2>{props.product.nome.length > 93
                                    ? `${props.product.nome.slice(0, 93)}...`
                                    : props.product.nome}
                                </h2>
                                <div className={styles.price}>
                                    <strong className={styles.currentPrice}><span>R$</span>{parseFloat(toString(props.product.valorVenda)).toFixed(2)}</strong>
                                    <span className={styles.installment}>10x de R$ {`${(props.product.valorVenda / 10).toFixed(2)} sem juros`}</span>
                                </div>
                            </div>}
                    </div>
                </a>
            </Link>
        </li>
    );
}

export default ProductItem;