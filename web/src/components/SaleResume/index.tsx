import router from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Container, Row, Col, Alert, Figure, Button, Form } from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import { MdCancel } from "react-icons/md";
import { useToasts } from "../../contexts/ToastContext";
import { environment } from "../../environments/environment";
import { Order } from "../../models/Order";
import api from "../../services/api";
import { Utils } from "../../shared/classes/utils";
import { ModalExclusion, ModalLarge, ModalSmall } from "../Modal";
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
        <ModalLarge show={showSaleModal} title={`Pedido #${props.order.id}`} onHide={() => { setShowSaleModal(false); props.onClose(false); }}>
            <Row>
                <div className={styles.summary}>
                    <Container fluid>
                        <Row className="justify-content-md-center">
                            <Col xs lg={5}>
                                <Alert variant="secondary" >
                                    <Alert.Heading>Status: {props.order.status}</Alert.Heading>
                                </Alert>
                            </Col>
                            <Col xs lg={5}>
                                <Alert variant="primary">
                                    <Alert.Heading>Codigo de rastreio: {order.codRastreio == '' ? '-------------' : order.codRastreio}</Alert.Heading>
                                </Alert>
                            </Col>
                        </Row>
                    </Container>
                    <div className={styles.list}>
                        <Col>
                            {props.order.itensVenda.map((item, index) => {
                                return (
                                    <div id={`item-${item.id}`} className={styles.item} key={index}>
                                        <Figure>
                                            <Figure.Image
                                                width={50}
                                                height={50}
                                                alt={`${item.produto.nome}`}
                                                src={`${environment.API}/${item.produto.imagens[0].path}`}
                                            />
                                        </Figure>
                                        <div className={styles.name}>{item.produto.nome}</div>
                                        <div className={`${styles.qtd} ${styles.center}`}>
                                            <div>{item.quantidade}</div>
                                        </div>
                                        <div className={`${styles.price} ${styles.center}`}><span>R$</span>{Utils.formatMoney(item.valorUnit)}</div>
                                        <div className={`${styles.price} ${styles.center}`}><span> Subtotal: R$</span>{Utils.formatMoney(item.valorSubTotal)}</div>
                                    </div>
                                );
                            })}
                        </Col>
                        <strong><label className={styles.sub}>Subtotal da compra</label></strong>
                        <span className={styles.price}>
                            <span>R$</span>
                            {Utils.formatMoney(props.order.subtotal)}
                        </span>
                        <strong><label className={styles.frete}>Frete</label></strong>
                        <span className={styles.price}>
                            <span>R$</span>
                            {Utils.formatMoney(props.order.valorFrete)}
                        </span>
                        <hr />
                        <strong><label className={styles.total}>Total da compra</label></strong>
                        <span className={styles.priceTotal}>
                            <span>R$</span>
                            {Utils.formatMoney(props.order.valorTotal)}
                        </span>
                    </div>
                </div>
                {erroCancel ? erroCancel.map((err) => {
                    return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
                }) : ``}
            </Row>
            <Row>
                <Col xs={6} sm={4} md={6} lg={4}>
                    <Button variant="danger" onClick={() => setShowCancelModal(true)}><MdCancel />Cancelar venda</Button>
                </Col>
                <Col xs={6} sm={4} md={6} lg={4}>
                    <Button variant="primary" onClick={() => setShowChangeModal(true)}><GrAdd />Inserir Codigo de rastreio</Button>
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
        </ModalLarge>
    )
}
export default SaleResume;