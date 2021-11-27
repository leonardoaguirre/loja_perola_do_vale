import Link from 'next/link';
import router from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { GrAdd } from 'react-icons/gr';
import { MdCancel } from 'react-icons/md';

import { useToasts } from '../../contexts/ToastContext';
import { environment } from '../../environments/environment';
import { Order } from '../../models/Order';
import api from '../../services/api';
import { Utils } from '../../shared/classes/utils';
import { ModalExclusion, ModalLarge, ModalSmall } from '../Modal';
import styles from './styles.module.css';

interface orderItemProps {
    order: Order;
    show: boolean;
    onClose(show: boolean);
}

const SaleResume: React.FC<orderItemProps> = (props) => {
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
    const [showChangeModal, setShowChangeModal] = useState<boolean>(false)
    const [showSaleModal, setShowSaleModal] = useState<boolean>(props.show)
    const [erroCadastro, setErroCadastro] = useState([]);
    const [erroCancel, setErroCancel] = useState([]);
    const [disabledAlt, setDisabledAlt] = useState<boolean>(true);
    const [order, setOrder] = useState<Order>(props.order)
    const [codR, setCodR] = useState<string>(props.order.codRastreio ? props.order.codRastreio : ``)
    const { add } = useToasts();


    useEffect(() => {
        if (order.codRastreio == codR || codR == '') {
            setDisabledAlt(true);
        } else {
            setDisabledAlt(false);
        }
    }, [codR])

    const cancelSale = (e) => {
        e.preventDefault()

        api.delete(`Venda/Cancelar/${props.order.id}`)
            .then((res: any) => {
                router.reload()
                add({
                    title: 'Venda cancelada',
                    content: `Venda (${order.id}) cancelada com sucesso!`,
                    delay: 8000,
                    autohide: true,
                });
            })
            .catch((err) => {
                console.log(err);
                setErroCancel(err)
            })
    }

    const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        api.patch(`Venda/AdicionarCodRastreio/`, {
            idVenda: order.id,
            codRastreio: codR,
        }).then(() => {
            setShowChangeModal(false)
            router.reload();
            add({
                title: 'Código de rastreio inserido',
                content: `Código (${codR}) inserido com sucesso!`,
                delay: 8000,
                autohide: true,
            });
        }).catch((err) => {
            setErroCadastro(err.response.data)
        })
    }
    return (
        <ModalLarge id={styles.saleResume} fullscreen show={showSaleModal} title={`Pedido #${props.order.id}`} onHide={() => { setShowSaleModal(false); props.onClose(false); }}>
            <Container className="px-0" fluid>
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className={styles.summary}>
                            <Container fluid>
                                <Row className="justify-content-md-center">
                                    <Col xs={12} sm={5}>
                                        <Alert className={styles.alert} variant="secondary" >
                                            <Alert.Heading><strong>Status:</strong><p>{props.order.status}</p></Alert.Heading>
                                        </Alert>
                                    </Col>
                                    <Col xs={12} sm={7}>
                                        <Alert className={styles.alert} variant="primary">
                                            <Alert.Heading><strong>Codigo de rastreio:</strong><p>{props.order.codRastreio ? props.order.codRastreio : '-------------'}</p></Alert.Heading>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                            <div className={styles.list}>
                                <Container className="px-0" fluid>
                                    <Row>
                                        {props.order.itensVenda.map((item, index) => {
                                            return (
                                                <Col xs={12} key={index}>
                                                    <div id={`item-${item.id}`} className={styles.item}>
                                                        <Container className={styles.itemContainer} fluid>
                                                            <Row>
                                                                <Col xs={3} sm={2}>
                                                                    <figure className={styles.imgContainer}>
                                                                        <Link href={`/products/info/${item.produto.id}`}>
                                                                            <a>
                                                                                <img src={`${environment.API}/${item.produto.imagens[0].path}`}
                                                                                    alt={item.produto.nome} title={item.produto.nome} />
                                                                            </a>
                                                                        </Link>
                                                                    </figure>
                                                                </Col>
                                                                <Col xs={3} sm={6}>
                                                                    <div className={styles.name}><p>{item.produto.nome}</p></div>
                                                                </Col>
                                                                <Col xs={3} sm={2}>
                                                                    <div className={styles.qtdPrice}>
                                                                        <div className={styles.qtd}>( {item.quantidade}x )</div>
                                                                        <div className={styles.price}><span>R$</span>{Utils.formatMoney(item.valorUnit)}</div>
                                                                    </div>
                                                                </Col>
                                                                <Col xs={3} sm={2}>
                                                                    <div className={styles.prodSub}><span>R$</span>{Utils.formatMoney(item.valorSubTotal)}</div>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Container>
                            </div>
                            <Container fluid>
                                <Row>
                                    <Col xs={12}>
                                        <div className={styles.spaceBetween}>
                                            <strong><label className={styles.sub}>Subtotal da compra</label></strong>
                                            <span className={styles.price}>
                                                <span>R$</span>
                                                {Utils.formatMoney(props.order.subtotal)}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <div className={styles.spaceBetween}>
                                            <strong><label className={styles.frete}>Frete</label></strong>
                                            <span className={styles.price}>
                                                <span>R$</span>
                                                {Utils.formatMoney(props.order.valorFrete)}
                                            </span>
                                        </div>
                                    </Col>
                                    <hr />
                                    <Col xs={12}>
                                        <div className={styles.spaceBetween}>
                                            <strong><label className={styles.total}>Total da compra</label></strong>
                                            <span className={styles.priceTotal}>
                                                <span>R$</span>
                                                {Utils.formatMoney(props.order.valorTotal)}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        {erroCancel ? erroCancel.map((err) => {
                            return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
                        }) : ``}
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={6} sm={4} md={6} lg={4}>
                        <Button
                            id={styles.cancel}
                            className="w-100"
                            variant="outline-danger"
                            onClick={() => setShowCancelModal(true)}
                        >
                            <MdCancel />
                            <strong>Cancelar venda</strong>
                        </Button>
                    </Col>
                    <Col xs={6} sm={4} md={6} lg={4}>
                        <Button
                            id={styles.insert}
                            className="w-100"
                            variant="primary"
                            onClick={() => setShowChangeModal(true)}
                        >
                            <GrAdd />
                            <strong>Inserir Codigo de rastreio</strong>
                        </Button>
                    </Col>
                </Row>
                {showCancelModal ?
                    <ModalExclusion
                        objN='venda'
                        show={showCancelModal}
                        onConfirm={(e) => cancelSale(e)}
                        onHide={() => setShowCancelModal(false)}
                    >Você realmente deseja cancelar esta venda?
                    </ModalExclusion>
                    : ''
                }
                {showChangeModal ?
                    <ModalSmall title="Alterar codigo de rastreio" onHide={() => { setShowChangeModal(false); setErroCadastro([]); setOrder(props.order); setCodR(``) }} show={showChangeModal}>
                        <Form id={styles.alterForm} onSubmit={(e) => onSubmitForm(e)}>
                            <Row >
                                <Col xs={8}>
                                    <Form.Group className='mb-3' controlId='numero'>
                                        <Form.Label>Código de rastreio</Form.Label>
                                        <Form.Control type='text' value={codR} onChange={(e) => { setCodR(e.target.value) }} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {erroCadastro ? erroCadastro.map((err) => {
                                return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
                            }) : ``}
                            <Row className="justify-content-md-center">
                                <Button className="w-100" variant="primary" type="submit" disabled={disabledAlt}>
                                    Inserir Código
                                </Button>
                            </Row>
                        </Form>
                    </ModalSmall>
                    : ``
                }
            </Container>
        </ModalLarge>
    )
}
export default SaleResume;