import { useEffect, useState } from "react";

import styles from './styles.module.css';
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';

interface CardPaymentProps {
  valorTotal: number;
}
const CardPayment: React.FC<CardPaymentProps> = ({
  valorTotal
}) => {
  const [tipoCartao, setTipoCartao] = useState<number>(null);

  const [total, setTotal] = useState<number>(valorTotal);
  const [nParcelas, setNParcelas] = useState<number>(1);

  useEffect(() => {
    setTotal(valorTotal);
  }, [valorTotal])

  useEffect(() => {
    setTotal(valorTotal/nParcelas);
  }, [nParcelas])

  const geraParcelas = () => {
    let parcelas = []
    for (let i = 1; i < 11; i++) {
      parcelas.push(
        <option key={i} value={`${i}`}>
          {i}x de {(valorTotal / i).toFixed(2).replace(`.`, `,`)} sem juros
        </option>
      )
    }
    return parcelas;
  }
  return (
    <>
      {(tipoCartao ? (
        <form className={styles.form}>
          <Container>
            <Row>
              <Col xs={12}>
                <div className={styles.inputContainer}>
                  <label><strong>Número do cartão</strong></label>
                  <InputGroup>
                    <FormControl
                      placeholder=""
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col xs={12}>
                <div className={styles.inputContainer}>
                  <label><strong>Nome do titular</strong></label>
                  <InputGroup>
                    <FormControl
                      placeholder=""
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col xs={6}>
                <div className={styles.inputContainer}>
                  <label><strong>Validade</strong></label>
                  <InputGroup>
                    <FormControl
                      placeholder=""
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col xs={6}>
                <div className={styles.inputContainer}>
                  <label><strong>CVV</strong></label>
                  <InputGroup>
                    <FormControl
                      placeholder=""
                    />
                  </InputGroup>
                </div>
              </Col>
              {(tipoCartao == 1 ?
                (
                  <>
                    <Col xs={12}>
                      <div className={styles.inputContainer}>
                        <label><strong>Parcelas</strong></label>
                        <Form.Select 
                          aria-label="" 
                          onChange={(event) => {
                            // @ts-ignore: Unreachable code error
                            setNParcelas(event.target.value)
                          }}
                        >
                          {geraParcelas()}
                        </Form.Select>
                      </div>
                    </Col>
                    <hr />
                    <Col xs={12}>
                      <strong className={styles.total}><span>Total:</span><span>R$ <span>{total.toFixed(2).replace('.', ',')}</span></span></strong>
                    </Col>
                    <Col xs={12}>
                      <p>{`em ${nParcelas}x no cartão`}</p>
                    </Col>
                    <Col xs={12}>
                      <Button className={styles.finish}><strong>Fechar Pedido</strong></Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <hr />
                    <Col xs={12}>
                      <strong className={styles.total}><span>Total:</span><span>R$ <span>{valorTotal.toFixed(2).replace('.', ',')}</span></span></strong>
                    </Col>
                    <Col xs={12}>
                      <p>em 1x no cartão</p>
                    </Col>
                    <Col xs={12}>
                      <Button className={styles.finish}><strong>Fechar Pedido</strong></Button>
                    </Col>
                  </>
                )
              )}
            </Row>
          </Container>
        </form>
      ) : (
        <div className={styles.cartoes}>
          <div className={styles.credito}>
            <Button
              variant="secondary"
              className={styles.button}
              onClick={() => setTipoCartao(1)}
            >
              <strong>Crédito</strong>
            </Button>
          </div>
          <div className={styles.debito}>
            <Button
              variant="primary"
              className={styles.button}
              onClick={() => setTipoCartao(2)}
            >
              <strong>Débito</strong>
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}
export default CardPayment;