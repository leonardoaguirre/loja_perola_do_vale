import { useEffect, useState } from 'react';
import { Button, Col, Container, FormControl, InputGroup, Row } from 'react-bootstrap';

import { Utils } from '../../../shared/classes/utils';
import styles from './styles.module.css';

interface DebtPaymentProps {
  valorTotal: number;
  onFinishSale: (event: React.FormEvent<HTMLFormElement>) => void;
}
const DebtPayment: React.FC<DebtPaymentProps> = ({
  valorTotal,
  onFinishSale,
}) => {
  const [total, setTotal] = useState<number>(valorTotal);
  const [nParcelas, setNParcelas] = useState<number>(1);

  useEffect(() => {
    setTotal(valorTotal);
  }, [valorTotal])

  useEffect(() => {
    setTotal(valorTotal / nParcelas);
  }, [nParcelas])

  const geraParcelas = () => {
    let parcelas = []
    for (let i = 1; i < 11; i++) {
      parcelas.push(
        <option key={i} value={`${i}`}>
          {i}x de {Utils.formatMoney(valorTotal / i)} sem juros
        </option>
      )
    }
    return parcelas;
  }
  return (
    <>
      <form onSubmit={(event) => onFinishSale(event)} className={styles.form}>
        <Container>
          <Row>
            <Col xs={12}>
              <div className={styles.inputContainer}>
                <label><strong>Número do cartão</strong></label>
                <InputGroup>
                  <FormControl
                    placeholder=""
                    required
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
                    required
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
                    required
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
                    required
                  />
                </InputGroup>
              </div>
            </Col>
            <hr />
            <Col xs={12}>
              <strong className={styles.total}><span>Total:</span><span>R$ <span>{Utils.formatMoney(valorTotal)}</span></span></strong>
            </Col>
            <Col xs={12}>
              <p>em 1x no cartão</p>
            </Col>
            <Col xs={12}>
              <Button type="submit" className={styles.finish}><strong>Fechar Pedido</strong></Button>
            </Col>
          </Row>
        </Container>
      </form>
    </>
  )
}
export default DebtPayment;