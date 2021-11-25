import { Accordion, Alert, Col, Container, Figure, Row } from "react-bootstrap"
import { environment } from "../../environments/environment";
import { Order } from "../../models/Order";
import { Utils } from "../../shared/classes/utils";
import styles from './styles.module.css';

interface orderItemProps {
    order: Order
}

const OrderItem: React.FC<orderItemProps> = (props) => {

    return (
        <div>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pedido #{props.order.id}</Accordion.Header>
                    <Accordion.Body>
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
                                            <Alert.Heading>Codigo de rastreio: {props.order.codRastreio == '' ? '-------------' : props.order.codRastreio}</Alert.Heading>
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    )
}
export default OrderItem;