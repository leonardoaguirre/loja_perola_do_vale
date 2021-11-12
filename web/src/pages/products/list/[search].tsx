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

interface ProductListProps {
  products: [Product[], number];
  search: string;
  activePage: number;
}

interface Product {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  valorVenda: number;
  codigoBarra: string;
  quantidade: number;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  imagens: Image[];
  categorias: Category[];
}

interface Image {
  id: string;
  originalName: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

interface Category {
  id: string;
  descricao: string;
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
      <div className={styles.productList}>
        <div className={styles.list}>
          <Container fluid>
            <Row>
              <Col xs={12}>
                <h1>Produtos</h1>
              </Col>
            </Row>
            <Row>
              {props.products[0].map((product, index) => (
                <Col key={index} className={styles.col} xs={6} sm={4} md={4} lg={3} xl={3}>
                  <ProductCard product={product} index={index} key={index} />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <div className={styles.pagination}>
          <PaginationBar nPages={props.products[1]}
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
      products: data,
      search: search,
      activePage: pagina ? pagina : 1
    }
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const response = await fetch(`${environment.API}/produto/listar`);
//   const data = await response.json();

//   const paths = data.map(product => {
//     return { params: { search: 'a' } }
//   });

//   return {
//     paths,
//     fallback: true
//   }

// }

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { search } = context.params;
//   console.log(context.params)

//   const response = await fetch(`${environment.API}/produto/procurar/${search}`);
//   const data = await response.json();

//   return {
//     props: {
//       products: data,
//     }
//   }
// }

export default ProductList;

/*
    import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import PageFooter from '../../components/PageFooter';
import PageHeader from '../../components/PageHeader';
import ProductItem from '../../components/ProductItem';
import SubHeader from '../../components/SubHeader';
import styles from '../../styles/pages/ProductList.module.css';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { Col, Container, Pagination, Row } from 'react-bootstrap';
import Header from '../../../components/Header/index';

interface ProductListProps {
  products: Product[];
}

interface Product {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  valorVenda: number;
  codigoBarra: string;
  quantidade: number;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  imagens: Image[];
  categorias: Category[];
}

interface Image {
  id: string;
  originalName: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

interface Category {
  id: string;
  descricao: string;
}

const ProductList: React.FC<ProductListProps> = (props) => {

  return (
    <div className="pageContainer">
      <Header />
      <Navigation />
      <div className={styles.productList}>
        <h1>Produtos</h1>
        <Container>
          <Row className={styles.row} xs={2} md={3} lg={4}>
            {props.products.map((product, index) => (
              <Col className={styles.col}>
                <ProductCard product={product} index={index} key={index} />
              </Col>
            ))}
          </Row>
        </Container>
        <div className={styles.pagination}>

        </div>
      </div>
      <Pagination className={styles.pagination}>
        <Pagination.First title="Primeiro" />
        <Pagination.Prev title="Anterior" />
        <Pagination.Ellipsis />

        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item active>{3}</Pagination.Item>
        <Pagination.Item>{4}</Pagination.Item>
        <Pagination.Item>{5}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Next title="Próximo" />
        <Pagination.Last title="Último" />
      </Pagination>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(`${environment.API}/Produto/Listar`);

  if (response.status == 200) {
    const data = await response.json();
    return {
      props: {
        products: data,
      }
    }
  }
}


export default ProductList;
*/