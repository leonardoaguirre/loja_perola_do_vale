import { GetServerSideProps } from 'next';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BiBarcode, BiCreditCard, BiCreditCardFront } from 'react-icons/bi';

import BankSlipPayment from '../../../components/BankSlipPayment';
import CreditPayment from '../../../components/CardPayment/Credit';
import DebtPayment from '../../../components/CardPayment/Debt';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import OrderResume from '../../../components/OrderResume';
import PostalAdressCard from '../../../components/PostalAdressCard/Card';
import PostalAdressCardNew from '../../../components/PostalAdressCard/New';
import ShippingCalc from '../../../components/Shipping';
import { CartContext } from '../../../contexts/CartContext';
import { StepperContext } from '../../../contexts/StepperContext';
import { environment } from '../../../environments/environment';
import { Costumer } from '../../../models/Costumer';
import { PostalAdress } from '../../../models/PostalAdress';
import { Product } from '../../../models/Product';
import api from '../../../services/api';
import styles from './styles.module.css';

interface CheckoutProps {
  products: [{
    produto: Product,
    disponivel: boolean
  }];
  costumer: Costumer;
}

const Checkout: React.FC<CheckoutProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { cartProducts, clearCart } = useContext(CartContext);
  const { currentStep, setCurrentStepNumber } = useContext(StepperContext);

  const [stepAux, setStepAux] = useState<number>(currentStep);

  const checkoutRef = useRef(null);
  const paymentRef = useRef(null);

  const [endEntrega, setEndEntrega] = useState<PostalAdress>(props.costumer.pessoaFisica.pessoa.enderecos[0] || null);
  const [frete, setFrete] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [deliveryType, setDeliveryType] = useState<number>();
  const [buscar, setBuscar] = useState<boolean>(false);

  const [modalShow, setModalShow] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('credito');
  const [paymentMethod, setPaymentMethod] = useState<string>(activeTab);

  const tabColor = (tab: string) => {
    if (activeTab == tab) {
      return '#14213d';
    } else {
      return '#a3a3a3';
    }
  }

  useEffect(() => {
    setCurrentStepNumber(3)
  }, [])

  useEffect(() => {
    if (stepAux < currentStep) {
      if (checkoutRef && paymentRef) {
        checkoutRef.current.className = `${styles.checkoutContainer} ${styles.slideOutAnimation}`;
        paymentRef.current.className = `${styles.paymentContainer} ${styles.slideInAnimation}`;
      }
    } else if (stepAux > currentStep) {
      if (checkoutRef && paymentRef) {
        checkoutRef.current.className = `${styles.checkoutContainer} ${styles.slideOutAnimation} ${styles.reverse}`;
        paymentRef.current.className = `${styles.paymentContainer} ${styles.slideInAnimation} ${styles.reverse}`;
      }
    }
    setStepAux(currentStep);
  }, [currentStep])

  useEffect(() => {
    setPaymentMethod(activeTab);
  }, [activeTab])

  useEffect(() => {
    if (cartProducts.length > 0) {
      setTotal(calculaTotal());
    }
  }, [cartProducts])

  useEffect(() => {
    if (cartProducts.length > 0) {
      setTotal(calculaTotal());
    }
  }, [frete])

  const calculaTotal = () => {
    const valoresProds = props.products.map((prod, i) => { return prod.produto.valorVenda * cartProducts[i].quantidade });
    return (valoresProds.reduce((total, num) => total + num, 0) + frete);
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
      produtos: cartProducts,
    }
    console.log(venda);
    api.post('Venda/Adicionar', venda)
      .then((res) => {
        console.log(res.data);
        clearCart()
        if (res.status === 200) {
          setCurrentStepNumber(5)
          router.push('/user/orderSuccess')
        }
      }).catch((error) => {
        console.log(error);
      })

  }

  return (
    <div className="pageContainer overflow-hidden">
      <Head>
        {(currentStep == 3) ? (
          <title>Confirmar Pedido | Ferragens Pérola do Vale</title>
        ) : (
          (currentStep == 4) ? (
            <title>Forma de pagamento | Ferragens Pérola do Vale</title>
          ) : (
            <title>Confirmar Pedido | Ferragens Pérola do Vale</title>
          )
        )}
      </Head>
      <Header headerType="checkout" />
      <div className="pageContent fx-column align-i-center nowrap">
        <div ref={checkoutRef} className={styles.checkoutContainer}>
          <form action="post" onSubmit={(e) => checkout(e)}>
            <Container fluid>
              <Row id={styles.firstRow} className="justify-content-center">
                <Col xs={12} sm={8} md={5}>
                  <h2>Endereço de entrega</h2>
                  {((endEntrega) ? (
                    <>
                      <div className={styles.postalAdressContainer}>
                        <PostalAdressCard postalAdress={endEntrega} />
                      </div>
                      <Button variant="primary" onClick={() => setModalShow(true)}>
                        Trocar de Endereço
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className={styles.postalAdressNewContainer}>
                        <PostalAdressCardNew />
                      </div>
                      <div className={styles.shipping}>
                        <ShippingCalc
                          produtos={cartProducts}
                          getFrete={getFrete}
                          setDeliveryType={(deliveryType) => setDeliveryType(deliveryType)}
                          emitEventDeliveryType={true}
                        />
                      </div>
                    </>
                  ))}

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
                  {cartProducts.length > 0 && endEntrega ?
                    <div className={styles.shippingOptions}>
                      {/* <span className={styles.buscar}>
                        <ToggleSwitch name="buscar" small={true} checked={buscar} onChange={setBuscar} />
                        <label>Buscar na loja</label>
                      </span> */}

                      <h3>Opções de frete</h3>
                      <div className={styles.shipping}>
                        <ShippingCalc
                          produtos={cartProducts}
                          getFrete={getFrete}
                          freteAuto={endEntrega}
                          setDeliveryType={(deliveryType) => setDeliveryType(deliveryType)}
                          emitEventDeliveryType={true}
                          dontShowInput={true}
                          dontShowAdress={true}
                          hasPlaceholder={true}
                        />
                      </div>
                    </div>
                    : ``
                  }
                </Col>
                <Col xs={12} sm={8} md={5}>
                  <div className={styles.rightContainer}>
                    <div className={styles.summaryContainer}>
                      <h2>Resumo da compra</h2>
                      <div className={styles.summary}>
                        {
                          <OrderResume products={cartProducts} frete={frete} />
                        }
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <Button id={styles.backToShop} onClick={() => router.push('/')}><AiOutlineArrowLeft />Voltar as Compras</Button>
                      <Button onClick={() => setCurrentStepNumber(4)} disabled={deliveryType == null}>Prosseguir</Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </form>
        </div>
        <div id="paymentRef" ref={paymentRef} className={styles.paymentContainer}>
          <Button id={styles.backButton} onClick={() => setCurrentStepNumber(3)}><AiOutlineArrowLeft />Voltar</Button>
          <div className={styles.flexRow}>
            <h2>Formas de pagamento</h2>
          </div>
          <Tabs
            id="controlled-tab-example"
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-3"
          >
            <Tab
              id="creditoTab"
              eventKey="credito"
              title={
                <div className={styles.tabTitle}>
                  <div className={styles.svgContainer}>
                    <BiCreditCardFront color={tabColor('credito')} />
                  </div>
                  <strong style={{ color: tabColor('credito') }}>Crédito</strong>
                </div>
              }
              className={styles.tab}
            >
              <CreditPayment valorTotal={total} onFinishSale={(event) => checkout(event)} />
            </Tab>
            <Tab
              id="debitoTab"
              eventKey="debito"
              title={
                <div className={styles.tabTitle}>
                  <div className={styles.svgContainer}>
                    <BiCreditCard color={tabColor('debito')} />
                  </div>
                  <strong style={{ color: tabColor('debito') }}>Débito</strong>
                </div>
              }
              className={styles.tab}
            >
              <DebtPayment valorTotal={total} onFinishSale={(event) => checkout(event)} />
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
              <BankSlipPayment valorTotal={total} onFinishSale={(event) => checkout(event)} />
            </Tab>
          </Tabs>
        </div>
      </div>
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

    const responseUser = await fetch(`${environment.API}/cliente/BuscaPorId/${userData.id}`);

    const cookieProds = JSON.parse(cartProducts);
    let prods: Product[] = [];

    for (const prod of cookieProds) {
      const response = await fetch(`${environment.API}/Produto/BuscarPorId/${prod.id}`)
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