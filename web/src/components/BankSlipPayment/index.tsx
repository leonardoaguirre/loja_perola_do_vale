import styles from './styles.module.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

interface BankSlipPaymentProps {
  valorTotal: number;
  onFinishSale: (event: React.FormEvent<HTMLFormElement>) => void;
}

const BankSlipPayment: React.FC<BankSlipPaymentProps> = ({
  valorTotal,
  onFinishSale
}) => {
  return (
    <form onSubmit={(event) => onFinishSale(event)} className="pageContainer">
      <Container>
        <Row>
          <Col xs={12}>
            <strong className={styles.total}><span>Total:</span><span>R$ <span>{valorTotal.toFixed(2).replace('.', ',')}</span></span></strong>
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