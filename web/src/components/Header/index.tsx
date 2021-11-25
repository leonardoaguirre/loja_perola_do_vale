import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { AiOutlineUser } from 'react-icons/ai';
import { BsCardChecklist } from 'react-icons/bs';
import { MdDoneOutline, MdOutlineShoppingCart, MdPayment } from 'react-icons/md';

import { UserContext } from '../../contexts/UserContext';
import Input from '../Input/Search';
import Stepper from '../Stepper';
import styles from './styles.module.css';

interface HeaderProps {
  headerType?: 'default' | 'checkout' | 'adm' | 'login';
  currentStep?: number;
}

const Header: React.FC<HeaderProps> = ({
  headerType,
  currentStep
}) => {
  const router = useRouter();

  const { user, logoutUser } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>(headerType ? headerType : 'default');

  const handleSearch = () => {
    if (search) {
      router.push(`/products/list/${search}`);
    } else {
      alert("Preencha o campo de pesquisa!");
    }
  }

  return (
    <Container fluid color="secondary">
      <Row>
        <header className={(type == 'login') ? (`${styles.loginHeader}`) : (`${styles.pageHeader}`)}>
          <div className={styles.topBarContainer}>
            <Col xs={6} sm={5} md={3} lg={3} xl={3}>
              <Link href="/">
                <a>
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
                </a>
              </Link>
            </Col>
            {(type == 'default' ? (
              <>
                <Col xs={12} sm={12} md={5} lg={4} xl={5}>
                  <Input
                    handleInputChange={(value) => setSearch(value)}
                    handleSubmit={handleSearch}
                    placeholder="Busque seu produto aqui"
                  ></Input>
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
                        <div className={styles.nolog}>
                          <Link href="/user/login">
                            <a>Faça Login</a>
                          </Link>
                          <div className={styles.inline}>
                            <div>ou</div>
                            <Link href="/user/form">
                              <a>Cadastre-se</a>
                            </Link>
                          </div>
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
              </>
            ) : (
              ''
            ))}
            {(type == 'checkout' ? (
              <Col xs={6} sm={7} md={9} lg={9} xl={9}>
                <div className={styles.center}>
                  <Stepper
                    steps={[
                      {
                        title: "Carrinho",
                        path: "user/cart",
                        icon: () => <MdOutlineShoppingCart color="#000000" />
                      },
                      {
                        title: "Identificação",
                        path: "user/login",
                        icon: () => <AiOutlineUser color="#000000" />
                      },
                      {
                        title: "Conferência",
                        path: 'forms/checkout',
                        icon: () => <BsCardChecklist color="#000000" />
                      },
                      {
                        title: "Pagamento",
                        path: 'forms/checkout',
                        icon: () => <MdPayment color="#000000" />
                      },
                      {
                        title: "Concluído",
                        path: 'forms/checkout',
                        icon: () => <MdDoneOutline color="#000000" />
                      },
                    ]}
                  >
                  </Stepper>
                </div>
              </Col>
            ) : (
              ''
            ))}
            {(type == 'login') ? ('') : ('')}
          </div>
        </header>
      </Row>
    </Container>
  );
};

export default Header;
