import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { BsCartX } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';

import CartList from '../../../components/CartList';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import Shipping from '../../../components/Shipping';
import { CartContext } from '../../../contexts/CartContext';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/Product';
import { Utils } from '../../../shared/classes/utils';
import styles from './styles.module.css';

interface CartProps {
  data: [{
    produto: Product;
    disponivel: boolean;
  }];
}
const Cart: React.FC<CartProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { cartProducts } = useContext(CartContext);
  const [frete, setFrete] = useState<number>();
  const [subtotal, setSubTotal] = useState<number>(0);

  useEffect(() => {
    if (cartProducts.length > 0) {
      setSubTotal(calculaTotal());
    }
  }, [cartProducts])

  useEffect(() => {
    if (cartProducts.length > 0) {
      setSubTotal(calculaTotal());
    }
  }, [frete])

  const calculaTotal = () => {
    const valoresProds = cartProducts.map((cartProd, i) => props.data[i].produto.valorVenda * cartProd.quantidade);
    return (valoresProds.reduce((total, num) => total + num, 0))
  }

  const getFrete = (frete) => {
    setFrete(parseFloat(frete.Valor.replace(',', '.')))
  }

  const handleChangedQuantity = () => {
    if (cartProducts.length > 0) {
      setSubTotal(calculaTotal());
    }
  }

  return (
    <div className="pageContainer">
      <Head><title>Meu Carrinho | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <div>
          <h2>Carrinho de Compras</h2>
        </div>
        <div className={styles.content}>
          <Container fluid>
            <Row>
              {(cartProducts.length > 0 ? (
                <>
                  <Col xs={12} md={7} lg={8}>
                    <div className={styles.left}>
                      <div className={styles.cartList}>
                        <CartList
                          products={cartProducts}
                          onChangedQuantity={handleChangedQuantity}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={5} lg={4}>
                    <div className={styles.right}>
                      <div className={styles.summary}>
                        <div>
                          <div>
                            <h2>Resumo do pedido</h2>
                          </div>
                          <div className={styles.description}>
                            <div className={styles.top}>
                              <div className={styles.row}>
                                <label>{cartProducts.length} Produto(s)</label><span className={styles.price}>{`R$${Utils.formatMoney(subtotal)}`}</span>
                              </div>
                              <div className={styles.row}>
                                <label>Frete</label><span>{`R$ ${frete ? Utils.formatMoney(frete) : `--`}`}</span>
                              </div>
                            </div>
                            <hr />
                            <div className={styles.bottom}>
                              <div className={`${styles.row} ${styles.total}`}>
                                <label>Total</label><span className={styles.price}>{`R$${frete ? Utils.formatMoney(subtotal + frete) : Utils.formatMoney(subtotal)}`}</span>
                              </div>
                              <div className={`${styles.row} ${styles.installment}`}>
                                <label>Em até 10x sem juros de</label><span>{`R$${frete ? Utils.formatMoney((subtotal + frete) / 10) : Utils.formatMoney(subtotal / 10)}`}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className={styles.frete}>
                          <h3>Calcular Frete</h3>
                          <Shipping produtos={cartProducts} getFrete={getFrete} />
                        </div>
                        <hr />
                        <div className={styles.buy}>
                          <Link href={"/forms/checkout"}>
                            <a>
                              <button>Continuar</button>
                            </a>
                          </Link>
                        </div>
                        <div className={styles.keep}>
                          <Link href={"/products/list/a"} >
                            <a>
                              <button>Continuar Comprando</button>
                            </a>
                          </Link>
                        </div>
                      </div >
                    </div >
                  </Col>
                </>
              ) : (
                <div className={styles.empty}>
                  <BsCartX />
                  <div>
                    <h3>Você não possui nenhum<br /> produto no carrinho</h3>
                    <Link href={"/"} >
                      <a>
                        <Button id={styles.backToBuy}><IoIosArrowBack />Voltar para as Compras</Button>
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </Row>
          </Container>
        </div >
      </div >
    </div >
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cartProducts } = context.req.cookies;
  let data = [];

  if (cartProducts) {
    const prods = JSON.parse(cartProducts);

    for (const prod of prods) {
      const response = await fetch(`${environment.API}/Produto/BuscarPorId/${prod.id}`)
      const dat = await response.json()
      data.push(dat)
    }
  }

  return {
    props: {
      data: data
    }
  }
}

export default Cart;