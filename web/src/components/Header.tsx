import Link from "next/link";
import { useContext, useState } from "react";

import { UserContext } from "../contexts/UserContext";

import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import styles from "../styles/components/Header.module.css";
import Logo from "./Logo";

interface HeaderProps { }

const Header: React.FC<HeaderProps> = (props) => {
  const { user, logoutUser } = useContext(UserContext);

  const [search, setSearch] = useState("");

  const handleInputSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Container fluid color="secondary">
      <Row>
        <header className={styles.pageHeader}>
          <div className={styles.topBarContainer}>
            <Col xs={3}>
              <Logo imgheight="5.5rem" titleheight="4.5rem" color="black" />
            </Col>
            <Col xs={4}>
              <InputGroup className={styles.inputContainer} size="lg">
                <FormControl
                  className={styles.searchInput}
                  onChange={handleInputSearch}
                  placeholder="Busque seu produto aqui"
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                />
                <Button className={styles.searchButton} variant="light" id="button-addon2">
                  {/* <Link href={`/productList/${search}`}>
                    <a>
                      <img
                        src="/icons/search-black-36dp.svg"
                        alt="Lupa"
                        title="Buscar"
                      />
                    </a>
                  </Link> */}
                  <img
                    src="/icons/search-black-36dp.svg"
                    alt="Lupa"
                    title="Buscar"
                  />
                </Button>
              </InputGroup>
            </Col>
            <Col xs={2}>
              <div className={styles.userContainer}>
                {user ? (
                  <Link href="/userInfo">
                    <a>
                      <img
                        src="/icons/account_circle-black-36dp.svg"
                        alt="Usuário"
                        title="Minha Conta"
                      />
                    </a>
                  </Link>
                ) : (
                  <Link href="/login">
                    <a>
                      <img
                        src="/icons/account_circle-black-36dp.svg"
                        alt="Usuário"
                        title="Minha Conta"
                      />
                    </a>
                  </Link>
                )}

                {user ? (
                  <div className={styles.userInfo}>
                    <strong>{user.nome}</strong>
                    <div className={styles.log}>
                      <Link href="/userInfo">
                        <a>Minha Conta</a>
                      </Link>
                      <button onClick={logoutUser}>Sair</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.userInfo}>
                    <div className={styles.log}>
                      <Link href="/login">
                        <a>Entrar</a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col xs={1}>
              <div className={styles.userActions}>
                <div className={styles.shoppingCart}>
                  <Link href="/shoppingCart">
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
                  <Link href="/favoriteItens">
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
