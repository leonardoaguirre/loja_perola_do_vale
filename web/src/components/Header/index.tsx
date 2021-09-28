import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

import { UserContext } from "../../contexts/UserContext";

import Logo from "../Logo/index";

import styles from "./styles.module.css";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = (props) => {
  const router = useRouter();

  const { user, logoutUser } = useContext(UserContext);

  const [search, setSearch] = useState("");

  const handleInputSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    if (search) {
      router.push(`http://localhost:3000/products/list/${search}`);
    } else {
      alert("Preencha o campo de pesquisa!");
    }
  }

  return (
    <Container fluid color="secondary">
      <Row>
        <header className={styles.pageHeader}>
          <div className={styles.topBarContainer}>
            <Col xs={6} sm={5} md={3} lg={3} xl={3}>
              <div className={styles.logo}>
                {/* <Logo color="black" /> */}
                <img 
                  id={styles.logoImg} 
                  src="/icons/logo.png" 
                  alt="Logo Ferragens Pérola do Vale" 
                  title="Logo Ferragens Pérola do Vale" 
                />
                <img 
                  id={styles.logoTitle} 
                  src="/icons/ferragens-perola-do-vale-preto.png" 
                  alt="Logo título Ferragens Pérola do Vale" 
                  title="Logo título Ferragens Pérola do Vale" 
                />
              </div>
            </Col>
            <Col xs={12} sm={12} md={5} lg={4} xl={5}>
              <InputGroup className={styles.inputContainer} size="lg">
                <FormControl
                  className={styles.searchInput}
                  onChange={handleInputSearch}
                  placeholder="Busque seu produto aqui"
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                />
                <Button className={styles.searchButton} variant="light" id="button-addon2" onClick={handleSearch}>
                  <img
                    src="/icons/search-black-36dp.svg"
                    alt="Lupa"
                    title="Buscar"
                  />
                </Button>
              </InputGroup>
            </Col>
            <Col xs={3} sm={4} md={2} lg={3} xl={3}>
              <div className={styles.userContainer}>
                {user ? (
                  <Link href="/user/account">
                    <a>
                      <img
                        src="/icons/account_circle-black-36dp.svg"
                        alt="Usuário"
                        title="Minha Conta"
                      />
                    </a>
                  </Link>
                ) : (
                  <Link href="/user/login">
                    <a>
                      <img
                        src="/icons/account_circle-black-36dp.svg"
                        alt="Usuário"
                        title="Entrar"
                      />
                    </a>
                  </Link>
                )}

                {user ? (
                  <div className={styles.userInfo}>
                    <strong>{user.nome}</strong>
                    <div className={styles.log}>
                      <Link href="/user/account">
                        <a>Minha&nbsp;Conta</a>
                      </Link>
                      <div className={styles.divider}></div>
                      <button onClick={logoutUser}>Sair</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.userInfo}>
                    <div className={styles.log}>
                      <Link href="/user/login">
                        <a>Entrar</a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col xs={3} sm={3} md={2} lg={1} xl={1}>
              <div className={styles.userActions}>
                <div className={styles.shoppingCart}>
                  <Link href="/user/cart">
                    <a>
                      <img
                        src="/icons/shopping_cart-black-36dp.svg"
                        alt="Carrinho de compras"
                        title="Carrinho"
                      />
                    </a>
                  </Link>
                </div>
                <div className={styles.favoriteItens}>
                  <Link href="/user/favorites">
                    <a>
                      <img
                        src="/icons/favorite_border-black-36dp.svg"
                        alt="Coração"
                        title="Favoritos"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </Col>
          </div>
        </header>
      </Row>
    </Container>
  );
};

export default Header;
