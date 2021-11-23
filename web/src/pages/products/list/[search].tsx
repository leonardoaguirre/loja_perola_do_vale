import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import Nav from '../../../components/Nav';
import PaginationBar from '../../../components/PaginationBar';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../models/Product';
import api from '../../../services/api';
import styles from './styles.module.css';

interface ProductListProps {
  products: Product[];
  search: string;
  nPages: number;
  activePage: number;
}

const ProductList: React.FC<ProductListProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  return (
    <div className="pageContainer">
      <Head><title>{props.search} | Ferragens Pérola do Vale</title></Head>
      <Header />
      <Nav />
      <div id={styles.productList} className="pageContent">
        {props.products.length > 0 ?
          <>
            <div className={styles.list}>
              <Container fluid>
                <Row>
                  <Col xs={12}>
                    <h1>Produtos</h1>
                  </Col>
                </Row>
                <Row>
                  {props.products.map((product, index) => (
                    <Col key={index} className={styles.col} xs={6} sm={4} md={4} lg={3} xl={3}>
                      <ProductCard product={product} index={index} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
            <div className={styles.pagination}>
              <PaginationBar nPages={props.nPages}
                search={props.search}
                destination={'products/list'}
                activePage={props.activePage} />
            </div>
          </>
          :
          <Row>
            <h3>Nenhum produto foi encontrado</h3>
          </Row>
        }
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { search } = context.params;
  const { pagina } = context.query;

  let data;
  await api.get(`produto/procurar/${search}?pagina=${pagina}`)
    .then((res) => data = res.data)
    .catch((err) => console.log(err))

  if (!data) return { props: { products: [], } }

  return {
    props: {
      products: data.products,
      search: search,
      nPages: data.nPages,
      activePage: pagina ? pagina : 1
    }
  }
}

export default ProductList;