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
    <div className={styles.container}>
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
  const response = await fetch('http://localhost:3008/Produto/Listar');

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