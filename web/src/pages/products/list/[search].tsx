import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Col, Container, Pagination, Row } from 'react-bootstrap';

import LoadingIcon from '../../../components/LoadingIcon';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Nav from '../../../components/Nav';
import ProductCard from '../../../components/ProductCard';

import styles from './styles.module.css';
import PaginationBar from '../../../components/PaginationBar';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/Product';

interface ProductListProps {
  products: Product[];
  search: string;
  nPages: number;
  activePage: number;
}

const ProductList: React.FC<ProductListProps> = (props) => {

  const [hasDiscount, setHasDiscount] = useState(false);

  const handleClickProductItem = () => {

  }

  useEffect(() => {

  }, [])

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { query } = useRouter();

  return (
    <div className="pageContainer">
      <Header />
      <Nav />
      <div id={styles.productList} className="pageContent">
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
                  <ProductCard product={product} index={index} key={index} />
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
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { search } = context.params;
  const { pagina } = context.query;

  const response = await fetch(`${environment.API}/produto/procurar/${search}?pagina=${pagina}`);
  const data = await response.json();

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