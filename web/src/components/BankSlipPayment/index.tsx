import styles from './styles.module.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

interface BankSlipPaymentProps {
  valorTotal: number;
}

const BankSlipPayment: React.FC<BankSlipPaymentProps> = ({
  valorTotal
}) => {
  return (
    <div className={styles.container}>
      <Container>
        <Row>
          <Col xs={12}>
            <strong className={styles.total}><span>Total:</span><span>R$ <span>{valorTotal.toFixed(2).replace('.', ',')}</span></span></strong>
          </Col>
          <Col xs={12}>
            <p>em 1x no cartão</p>
          </Col>
          <Col xs={12}>
            <Button className={styles.finish}><strong>Fechar Pedido</strong></Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BankSlipPayment;