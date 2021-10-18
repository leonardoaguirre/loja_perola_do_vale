import { useEffect, useState } from "react";
import { Product } from "../../models/Product";

import styles from './styles.module.css';
import Link from 'next/link';

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
                <div className={`${styles.price} ${styles.center}`}><span>R$</span>{parseFloat(props.products[index].valorVenda.toString()).toFixed(2).replace('.', ',')}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.spaceBetween}>
          <strong><label className={styles.sub}>Subtotal</label></strong>
          <span className={styles.price}>
            <span>R$</span>
            {subtotal.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div className={styles.spaceBetween}>
        <strong><label className={styles.frete}>Frete</label></strong>
          <span className={styles.price}>
            <span>R$</span>
            {frete.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <hr />
        <div className={styles.spaceBetween}>
        <strong><label className={styles.total}>Total</label></strong>
          <span className={styles.priceTotal}>
            <span>R$</span>
            {(subtotal + frete).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>



      {/* {props.products ?
        <table>
          <thead>
            <tr>
              <td>Produto</td>
              <td>Quantidade</td>
              <td>Preço</td>
            </tr>
          </thead>

          <tbody>
            {props.products.map((prod, i) => {
              return (
                <tr key={i} id={`item-${prod.id}`}>
                  <td>{prod.nome}</td>
                  <td>{prod.quantidade}</td>
                  <td><span>R$</span>{parseFloat(prod.valorVenda.toString()).toFixed(2).replace('.', ',')}</td>
                </tr>
              )
            })}
          </tbody>
          <label>Subtotal: <span>R$ {props.products.map((prod, i) => { return (prod.valorVenda * prod.quantidade).toFixed(2).replace('.', ',') })}</span></label>
          <label>Frete: <span>R$ {frete.toFixed(2).replace('.', ',')}</span></label>
        </table>


        :
        <h3>Voce nao possui nenhum produto no carrinho</h3>
      } */}
    </>

  )
}
export default OrderResume;