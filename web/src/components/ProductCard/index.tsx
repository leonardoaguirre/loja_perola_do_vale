import Link from 'next/link';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { environment } from '../../environments/environment';
import { Product } from '../../models/Product';

import styles from './styles.module.css';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {

  const [hasDiscount, setHasDiscount] = useState<boolean>(false);

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Card key={props.index} className={styles.item}>
      <Link href={`/products/info/${props.product.id}`}>
        <a>
          <Card.Header className={styles.header}>
            {hasDiscount
              ? <div className={styles.discount}>-10%</div>
              : ''}
          </Card.Header>
          {hasDiscount
            ? <div className={`${styles.content} ${styles.hasDiscount}`}>
              <figure className={styles.figure}>
                <div className={styles.imgContainer}>
                  <Card.Img className={styles.img} variant="top" src={`${environment.API}/${props.product.imagens[0].path}`} alt={Capitalize(props.product.nome)} title={Capitalize(props.product.nome)} loading="lazy" />
                </div>
              </figure>
              <Card.Body className={styles.body}>
                <Card.Title className={styles.title} title={Capitalize(props.product.nome)}>{Capitalize(props.product.nome)}</Card.Title>
                <div className={styles.price}>
                  <strong className={styles.oldPrice}><span>R$</span>{(props.product.valorVenda * 1.1).toFixed(2).replace('.', ',')}</strong>
                  <strong className={styles.currentPrice}><span>R$</span>{parseFloat(props.product.valorVenda.toString()).toFixed(2).replace('.', ',')}</strong>
                  <span className={styles.installment}>10x de R$ {`${(props.product.valorVenda / 10).toFixed(2).replace('.', ',')} sem juros`}</span>
                </div>
              </Card.Body>
            </div>
            : <div className={styles.content}>
              <figure className={styles.figure}>
                <Card.Img className={styles.img} variant="top" src={`${environment.API}/${props.product.imagens[0].path}`} alt={Capitalize(props.product.nome)} title={Capitalize(props.product.nome)} />
              </figure>
              <Card.Body className={styles.body}>
                <Card.Title className={styles.title} title={Capitalize(props.product.nome)}>{Capitalize(props.product.nome)}</Card.Title>
                <div className={styles.price}>
                  <strong className={styles.currentPrice}><span>R$</span>{parseFloat(props.product.valorVenda.toString()).toFixed(2).replace('.', ',')}</strong>
                  <span className={styles.installment}>10x de R$ {`${(props.product.valorVenda / 10).toFixed(2).replace('.', ',')} sem juros`}</span>
                </div>
              </Card.Body>
            </div>
          }
        </a>
      </Link>
    </Card >
  );
}

export default ProductCard;