import Link from 'next/link';
import { useRef } from 'react';
import React from 'react';

import { Product } from '../../models/Product';
import InputNumber from '../Input/Number';
import styles from './styles.module.css';
import { environment } from '../../environments/environment';

interface CartListProps {
  products: Product[];
  onChangedQuantity: () => void;
}

const CartList: React.FC<CartListProps> = ({
  products,
  onChangedQuantity,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.cart}>
        <div className={styles.subtitle}>
          <h3 className={styles.start}>Produto</h3>
          <div></div>
          <h3>Quantidade</h3>
          <h3>Preço</h3>
        </div>
        <hr />
        <div className={styles.list}>
          {products.map((product, index) => {
            return (
              <div id={`item-${product.id}`} className={styles.item} key={index}>
                <div className={`${styles.imgContainer} ${styles.center}`}>
                  <Link href={`/products/info/${product.id}`}>
                    <a>
                      <img src={`${environment.API}/${product.imagens[0].path}`}
                        alt={product.nome} title={product.nome} />
                    </a>
                  </Link>
                </div>
                <div className={styles.name}><p>{product.nome}</p></div>
                <div className={`${styles.qtd} ${styles.center}`}>
                  <InputNumber initialQuantity={product.quantidade} idProduto={product.id} store={true} changedQuantity={onChangedQuantity} />
                </div>
                <div className={`${styles.price} ${styles.center}`}><span>R$</span>{parseFloat(product.valorVenda.toString()).toFixed(2).replace('.', ',')}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CartList;