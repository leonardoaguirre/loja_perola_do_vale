import Link from 'next/link';
import { Accordion, Alert, Col, Container, Row } from 'react-bootstrap';

import { environment } from '../../environments/environment';
import { Order } from '../../models/Order';
import { Utils } from '../../shared/classes/utils';
import styles from './styles.module.css';

interface orderItemProps {
	order: Order
}

const OrderItem: React.FC<orderItemProps> = (props) => {

	return (
		<div>
			<Accordion>
				<Accordion.Item eventKey="0">
					<Accordion.Header className={styles.accordionHeader}><div>Pedido #{props.order.id}</div><div>{props.order.itensVenda.length} Produto(s)</div><div className={styles.alignLeft}><span>R$</span>{Utils.formatMoney(props.order.valorTotal)}</div></Accordion.Header>
					<Accordion.Body className={styles.accordionBody}>
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
											<Alert.Heading><strong>Codigo de rastreio:</strong><p>{props.order.codRastreio == '' ? '-------------' : props.order.codRastreio}</p></Alert.Heading>
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
							<div className={styles.spaceBetween}>
								<strong><label className={styles.sub}>Subtotal da compra</label></strong>
								<span className={styles.price}>
									<span>R$</span>
									{Utils.formatMoney(props.order.subtotal)}
								</span>
							</div>
							<div className={styles.spaceBetween}>
								<strong><label className={styles.frete}>Frete</label></strong>
								<span className={styles.price}>
									<span>R$</span>
									{Utils.formatMoney(props.order.valorFrete)}
								</span>
							</div>
							<hr />
							<div className={styles.spaceBetween}>
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