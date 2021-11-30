import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Col, Container, Row } from 'react-bootstrap';

import styles from './styles.module.css';

interface MenuProps {

}

const Menu: React.FC<MenuProps> = (props) => {
  const router = useRouter();


  const goToPage = (url: string) => {

    if (url) {
      router.push(`/adm/manage/${url}`);
    }
  }

  return (
    <div className="pageContainer entire-page">
      <Head><title>Menu Administração | Ferragens Pérola do Vale</title></Head>
      <div className={styles.menu}>
        <Container fluid>
          <Row>
            <Col xs={12} sm={6}>
              <Button variant="primary" className={styles.item} onClick={() => goToPage("sales/list")}>Vendas</Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button variant="secondary" className={styles.item} onClick={() => goToPage("products/search")}>Produtos/Estoque</Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button variant="success" className={styles.item} onClick={() => goToPage("user/customer/search")}>Clientes</Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button variant="dark" className={styles.item} onClick={() => goToPage("user/employee/search")}>Funcionários</Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button variant="info" className={styles.item} onClick={() => goToPage("providers/search")}>Fornecedores</Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Menu;