import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CardPayment from "../../../components/CardPayment";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import LoadingIcon from "../../../components/LoadingIcon";
import OrderResume from "../../../components/OrderResume";
import PostalAdressCard from "../../../components/PostalAdressCard/Card";
import PostalAdressCardNew from "../../../components/PostalAdressCard/New";
import ShippingCalc from "../../../components/Shipping/ShippingCalc";
import { CartContext } from "../../../contexts/CartContext";
import { Adress, Costumer } from "../../../models/Costumer";
import { Product } from "../../../models/Product"
import api from "../../../services/api";
import Stepper from '../../../components/Stepper/index';

import styles from './styles.module.css';
import { Modal, Button, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { BsCardChecklist, BsFillCheckCircleFill, BsCreditCard2Back } from "react-icons/bs";
import { MdDoneOutline, MdOutlineShoppingCart, MdPayment } from "react-icons/md";
import { AiOutlineUser } from 'react-icons/ai';
import { BiBarcode } from 'react-icons/bi';

interface CheckoutProps {
  products: Product[];
  costumer: Costumer;
}

const Checkout: React.FC<CheckoutProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { products, clearCart } = useContext(CartContext);
  const [endEntrega, setEndEntrega] = useState<Adress>(props.costumer.pessoaFisica.pessoa.enderecos[0] || null);
  const [tipoPagamento, setTipoPagamento] = useState<number>();
  const [frete, setFrete] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [modalShow, setModalShow] = useState(false);

  const [currentStepNumber, setCurrentStepNumber] = useState<number>(4);

  const [activeTab, setActiveTab] = useState<string>('cartao');

  const tabColor = (tab: string) => {
    if (activeTab == tab) {
      return '#14213d';
    } else {
      return '#a3a3a3';
    }
  }

  const radioChange = (end: Adress) => {
    setEndEntrega(end);
  }
  const radioPaymentChange = (n: number) => {
    setTipoPagamento(n);
  }

  useEffect(() => {
    if (products.length > 0) {
      setTotal(calculaTotal());
    }
  }, [products])

  useEffect(() => {
    if (products.length > 0) {
      setTotal(calculaTotal());
    }
  }, [frete])

  const calculaTotal = () => {
    const valoresProds = props.products.map((prod, i) => { return prod.valorVenda * products[i].quantidade })
    return (valoresProds.reduce((total, num) => total + num, 0) + frete)
  }

  const getFrete = (frete) => {
    setFrete(parseFloat(frete.Valor.replace(',', '.')))
  }

  const checkout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const venda = {
      valorFrete: frete,
      idPessoa: props.costumer.pessoaFisica.pessoa.id,
      formaPagamento: {
        nomeTitular: props.costumer.pessoaFisica.nome,
      },
      destino: endEntrega,
      produtos: products,
    }
    console.log(venda);
    api.post('Venda/Adicionar', venda)
      .then((res) => {
        console.log(res.data);
        clearCart()
        if (res.status === 200) {

          router.push('/user/orderSuccess')
        }
      }).catch((error) => {
        console.log(error);
      })

  }
  return (
    <div className={styles.container}>
      <Header headerType="checkout" currentStep={currentStepNumber} />
      {/*
        <form action="post" onSubmit={(e) => checkout(e)}>
          <Container fluid>
            <Row id={styles.firstRow} className="justify-content-sm-center">
              <Col xs={5}>
                <h2>Endereço de entrega</h2>
                <div className={styles.postalAdressContainer}>
                  {endEntrega ? <PostalAdressCard postalAdress={endEntrega} /> : <PostalAdressCardNew />}
                </div>

                <Button variant="primary" onClick={() => setModalShow(true)}>
                  Trocar de Endereço
                </Button>

                {endEntrega ?
                  <MyModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  >
                    <div className={styles.cards}>
                      {props.costumer.pessoaFisica.pessoa.enderecos.length > 0 ?
                        props.costumer?.pessoaFisica.pessoa.enderecos.map((end, index) => {
                          return (
                            <div className={styles.item} key={index}>
                              <div
                                className={styles.wrapper}
                                onClick={() => { setEndEntrega(end); setModalShow(false) }}
                              >
                                <div className={styles.maxWidth}>
                                  <PostalAdressCard postalAdress={end} selected={endEntrega === end} selectable={true} />
                                </div>
                              </div>
                            </div>
                          )
                        })
                        :
                        <div className={styles.item}><PostalAdressCardNew /></div>
                      }
                    </div>
                    {props.costumer?.pessoaFisica.pessoa.enderecos.length < 3
                      ? <div className={styles.wrapper}><div className={styles.cardNew}><PostalAdressCardNew /></div></div>
                      : ''}
                  </MyModal>
                  :
                  <></>
                }
                {products.length > 0 && endEntrega ?
                  <div className={styles.shippingOptions}>
                    <h3>Opcoes de frete</h3>
                    <div className={styles.shipping}>
                      <ShippingCalc
                        produtos={products}
                        getFrete={getFrete}
                        freteAuto={endEntrega}
                        dontShowInput={true}
                        dontShowAdress={true}
                        hasPlaceholder={true}
                      />
                    </div>
                  </div>
                  : ``
                }
              </Col>
              <Col xs={5}>
                <>
                  <div>
                    <h2>Resumo da compra</h2>
                    {
                      <OrderResume products={products} frete={frete} />
                    }
                  </div>
                  <Button>Prosseguir</Button>
                </>
              </Col>
            </Row>
          </Container>
        </form>
      </div> */}
      <div id="paymentRef" className={styles.paymentContainer}>
        <h2>Formas de pagamento</h2>
        <Tabs
          id="controlled-tab-example"
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
          className="mb-3"
        >
          <Tab
            id="cartaoTab"
            eventKey="cartao"
            title={
              <div className={styles.tabTitle}>
                <div className={styles.svgContainer}>
                  <BsCreditCard2Back color={tabColor('cartao')} />
                </div>
                <strong style={{ color: tabColor('cartao') }}>Cartão</strong>
              </div>
            }
            className={styles.tab}
          >
            <CardPayment valorTotal={total} />
          </Tab>
          <Tab
            eventKey="boleto"
            title={
              <div className={styles.tabTitle}>
                <div className={styles.svgContainer}>
                  <BiBarcode color={tabColor('boleto')} />
                </div>
                <strong style={{ color: tabColor('boleto') }}>Boleto</strong>
              </div>
            }
            className={styles.tab}
          >
            Boleto
          </Tab>
        </Tabs>
      </div>
      {/* <label>
          <input type="radio" checked={tipoPagamento == 1} onChange={e => radioPaymentChange(1)} />
          Cartão
        </label>
        <label>
          <input type="radio" checked={tipoPagamento == 2} onChange={e => radioPaymentChange(2)} />
          Boleto
        </label>
        {
              ((tipoPagamento == 1) ?
                (
                  <CardPayment valorTotal={total} />
                ) : ((tipoPagamento == 2) ?
                  (
                    <h3>Clique em Finalizar compra</h3>
                  ) : (
                    ''
                  )
                )
              )
            }
        <h3>Total da Compra: R$ {total.toFixed(2).replace('.', ',')}</h3>
      <button type="submit">Finalizar Compra</button> */}
      {/* <Footer /> */}
    </div>
  )

}


const MyModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h4>Escolha o endereço de entrega</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Concluído</Button>
      </Modal.Footer>
    </Modal>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user, cartProducts } = context.req.cookies;

  if (!cartProducts) {
    return {
      redirect: {
        destination: '/user/cart',
        permanent: false,
      }
    }
  }

  if (user) {
    const userData = JSON.parse(user);

    const responseUser = await fetch(`http://localhost:3008/cliente/BuscaPorId/${userData.id}`);

    const cookieProds = JSON.parse(cartProducts);
    let prods: Product[] = [];

    for (const prod of cookieProds) {
      const response = await fetch(`http://localhost:3008/Produto/BuscarPorId/${prod.id}`)
      const dat = await response.json()
      prods.push(dat)
    }

    if (responseUser.status == 200 && prods.length > 0) {
      const userData = await responseUser.json();
      return {
        props: {
          costumer: userData,
          products: prods,
        }
      }
    }
  }

  return {
    redirect: {
      destination: '/user/login',
      permanent: false,
    },
  }

}
export default Checkout;