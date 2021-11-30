import { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Category } from '../../models/Category';
import api from '../../services/api';

import styles from './styles.module.css';

interface NavigationProps {

}

const Navigation: React.FC<NavigationProps> = (props) => {

  const [categorias, setCategorias] = useState<Category[]>([])

  useEffect(() => {
    api.get('Categoria/Listar')
      .then(res => setCategorias(res.data[0]))
      .catch(err => setCategorias([]))
  }, [])
  
  return (
    <Navbar className={styles.navigation} bg="light" variant="light" expand="md">
      <Container className={styles.navigationContent} fluid>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className={`me-auto ${styles.navigationItensContainer}`}>
            <NavDropdown
              id="nav-dropdown"
              title="Departamentos"
            >
              {categorias.length > 0 ?
                categorias.map((cat, i) => {
                  return <NavDropdown.Item key={i} href={`/products/list/${cat.descricao}`}> {cat.descricao}</NavDropdown.Item>
                })
                : <NavDropdown.Divider />
              }
            </NavDropdown>
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default Navigation;