import styles from './styles.module.css';
import { Product } from '../../models/Product';
import Link from 'next/link';
import { capitalize } from '@material-ui/core';
import { useRef } from 'react';
import React from 'react';

interface CartListProps {
  products: Product[];
  removeFromCart(id: string): void;
  changeQt(idProd: string, qt: number): boolean;
  calcSubtotal(): void;
}

const CartList: React.FC<CartListProps> = (props) => {

  let refs = useRef([React.createRef(), React.createRef()]);

  const removeItem = (id: string) => {
    const item = document.getElementById(`item-${id}`);
    item.removeChild;

    props.removeFromCart(id);
  }

  const OnChangeQt = (idProd: string, e: HTMLInputElement) => {
    if (props.changeQt(idProd, parseInt(e.value))) {
      props.calcSubtotal();
    } else {
      e.value = '1';
    }
  }

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
          {props.products.map((product, index) => {
            return (
              <div id={`item-${product.id}`} className={styles.item} key={index}>
                <div className={`${styles.imgContainer} ${styles.center}`}>
                  <Link href={`/products/info/${product.id}`}>
                    <a>
                      <img src={`http://localhost:3008/${product.imagens[0].path}`}
                        alt={capitalize(product.nome)} title={capitalize(product.nome)} />
                    </a>
                  </Link>
                </div>
                <div className={styles.name}>{product.nome}</div>
                <div className={`${styles.qtd} ${styles.center}`}>
                  <input type="number" defaultValue={1} onChange={(e) => OnChangeQt(product.id, e.target)} />
                  <button onClick={() => removeItem(product.id)}>Remover</button>
                </div>
                <div className={`${styles.price} ${styles.center}`}><span>R$</span>{parseFloat(props.products[index].valorVenda.toString()).toFixed(2).replace('.', ',')}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CartList;