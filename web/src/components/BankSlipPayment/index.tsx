import { Button, Col, Container, Row } from 'react-bootstrap';

import { Utils } from '../../shared/classes/utils';
import styles from './styles.module.css';

interface BankSlipPaymentProps {
  valorTotal: number;
  onFinishSale: (event: React.FormEvent<HTMLFormElement>) => void;
}

const BankSlipPayment: React.FC<BankSlipPaymentProps> = ({
  valorTotal,
  onFinishSale
}) => {
  return (
    <form onSubmit={(event) => onFinishSale(event)} className={styles.container}>
      <Container>
        <Row>
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
  );
}

export default BankSlipPayment;