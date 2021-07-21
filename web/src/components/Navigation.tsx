import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import styles from '../styles/components/Navigation.module.css';
import Link from 'next/link';

interface NavigationProps {

}

const Navigation: React.FC<NavigationProps> = (props) => {
  return (
    <Navbar className={styles.navigation} bg="light" variant="light" expand="md">
      <Container className={styles.navigationContent} fluid>
        {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className={`me-auto ${styles.navigationItensContainer}`}>
            <NavDropdown
              id="nav-dropdown"
              title="Departamentos"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;