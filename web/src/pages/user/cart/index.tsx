import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { CartContext } from "../../../contexts/CartContext";
import { Product } from "../../../models/Product";
import Shipping from '../../../components/Shipping/ShippingCalc';
import LoadingIcon from "../../../components/LoadingIcon";
import { useRouter } from "next/router";

import styles from './styles.module.css';
import CartList from "../../../components/CartList";

interface CartProps {
  products: Product[];
}
const Cart: React.FC<CartProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { products, changeQt, removeFromCart } = useContext(CartContext);
  const [frete, setFrete] = useState<number>();
  const [subtotal, setSubTotal] = useState<number>(0);

  useEffect(() => {
    if (products.length > 0) calcSubtotal()
  }, [products])

  const calcSubtotal = () => {
    let sum: number = 0

    products.map((prod, i) => {
      sum += props.products[i].valorVenda * prod.quantidade
    })

    console.warn(products);

    setSubTotal(sum);
  }

  const getFrete = (frete) => {
    setFrete(parseFloat(frete.Valor.replace(',', '.')))
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.cart}>
        <div>
          <h2>Carrinho de Compras</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.right}>
            {products.length > 0 ?
              <div className={styles.cartList}>
                <CartList
                  products={products}
                  removeFromCart={removeFromCart}
                  changeQt={changeQt}
                  calcSubtotal={calcSubtotal}
                />
              </div>
              : <div>Você não possui nenhum produto no carrinho</div>
            }
          </div>
          <div className={styles.left}>
            {products.length > 0 ?
              <div className={styles.summary}>
                <div>
                  <div>
                    <h2>Resumo do pedido</h2>
                  </div>
                  <div className={styles.description}>
                    <div className={styles.top}>
                      <div className={styles.row}>
                        <label>{products.length} Produto(s)</label><span className={styles.price}>R${subtotal.toFixed(2).replace(`.`, `,`)}</span>
                      </div>
                      <div className={styles.row}>
                        <label>Frete</label><span>R${frete ? frete.toFixed(2).replace(`.`, `,`) : `--`}</span>
                      </div>
                    </div>
                    <hr />
                    <div className={styles.bottom}>
                      <div className={`${styles.row} ${styles.total}`}>
                        <label>Total</label><span className={styles.price}>R$ {frete ? (subtotal + frete).toFixed(2).replace(`.`, `,`) : subtotal.toFixed(2).replace(`.`, `,`)}</span>
                      </div>
                      <div className={`${styles.row} ${styles.installment}`}>
                        <label>Em até 10x sem juros de</label><span>R${frete ? ((subtotal + frete) / 10).toFixed(2).replace(`.`, `,`) : (subtotal / 10).toFixed(2).replace(`.`, `,`)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className={styles.frete}>
                  <h3>Calcular Frete</h3>
                  <Shipping produtos={products} getFrete={getFrete} />
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
              : <div>
                <Link href={"/products/list/a"} >
                  <a>
                    <button>Voltar para as Compras</button>
                  </a>
                </Link>
              </div>
            }
          </div >
        </div >
      </div >
      {/* <Footer /> */}
    </div >
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cartProducts } = context.req.cookies;
  let data: Product[] = [];

  if (cartProducts) {
    const prods = JSON.parse(cartProducts);

    for (const prod of prods) {
      const response = await fetch(`http://localhost:3008/Produto/BuscarPorId/${prod.id}`)
      const dat = await response.json()
      data.push(dat)
    }
  }

  return {
    props: {
      products: data
    }
  }
}

export default Cart;