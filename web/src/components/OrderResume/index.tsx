import { useEffect, useState } from 'react';

import { Product } from '../../models/Product';
import { Utils } from '../../shared/classes/utils';
import styles from './styles.module.css';

interface OrderResumeProps {
  products: Product[];
  frete: number;
}

const OrderResume: React.FC<OrderResumeProps> = (props) => {
  const [frete, setFrete] = useState<number>(props.frete)
  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    setFrete(props.frete)
    let valor = 0;
    props.products.forEach(product => {
      valor += (product.valorVenda * product.quantidade);
    });
    setSubtotal(valor);
  }, [props])

  return (
    <>
      <div className={styles.summary}>
        <div className={styles.list}>
          {props.products.map((product, index) => {
            return (
              <div id={`item-${product.id}`} className={styles.item} key={index}>
                <div className={styles.name}>{product.nome}</div>
                <div className={`${styles.qtd} ${styles.center}`}>
                  <div>{product.quantidade}</div>
                </div>
                <div className={`${styles.price} ${styles.center}`}><span>R$</span>{Utils.formatMoney(props.products[index].valorVenda)}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.spaceBetween}>
          <strong><label className={styles.sub}>Subtotal</label></strong>
          <span className={styles.price}>
            <span>R$</span>
            {Utils.formatMoney(subtotal)}
          </span>
        </div>
        <div className={styles.spaceBetween}>
          <strong><label className={styles.frete}>Frete</label></strong>
          <span className={styles.price}>
            <span>R$</span>
            {Utils.formatMoney(frete)}
          </span>
        </div>
        <hr />
        <div className={styles.spaceBetween}>
          <strong><label className={styles.total}>Total</label></strong>
          <span className={styles.priceTotal}>
            <span>R$</span>
            {Utils.formatMoney(subtotal + frete)}
          </span>
        </div>
      </div>
    </>

  )
}
export default OrderResume;