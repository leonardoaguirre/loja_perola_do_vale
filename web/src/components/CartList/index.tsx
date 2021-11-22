import Link from 'next/link';
import { useRef } from 'react';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { environment } from '../../environments/environment';
import { Product } from '../../models/Product';
import { Utils } from '../../shared/classes/utils';
import InputNumber from '../Input/Number';
import styles from './styles.module.css';

interface CartListProps {
  products: Product[];
  onChangedQuantity: () => void;
}

const CartList: React.FC<CartListProps> = ({
  products,
  onChangedQuantity,
}) => {
  return (
    <div className={styles.cart}>
      <Container fluid>
        <Row>
          {products.map((product, index) => {
            return (
              <Col xs={12} sm={6} md={6} lg={12} xl={6}>
                <div id={`item-${product.id}`} className={styles.cartItem}>
                  <figure className={styles.imgContainer}>
                    <Link href={`/products/info/${product.id}`}>
                      <a>
                        <img src={`${environment.API}/${product.imagens[0].path}`}
                          alt={product.nome} title={product.nome} />
                      </a>
                    </Link>
                  </figure>
                  <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                      <div className={styles.name}><p>{product.nome}</p></div>
                      <div className={styles.qtdprc}>
                        <div className={styles.qtd}>
                          <InputNumber initialQuantity={product.quantidade} idProduto={product.id} store={true} changedQuantity={onChangedQuantity} />
                        </div>
                        <div className={styles.price}><span>R$</span>{Utils.formatMoney(product.valorVenda)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>

    </div>
  );
}

export default CartList;