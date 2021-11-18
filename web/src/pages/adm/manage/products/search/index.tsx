import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import Footer from '../../../../../components/Footer';
import Header from '../../../../../components/Header';
import ProductTable from '../../../../../components/ProductTable';
import SearchBox from '../../../../../components/SearchBox';
import { Product } from '../../../../../models/Product';
import api from '../../../../../services/api';
import styles from './styles.module.css';

interface ProductSearchProps {

}

const ProductSearch: React.FC<ProductSearchProps> = (props) => {

  const router = useRouter();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Product[]>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async (searchStr: string, atribute: string) => {

    let pagina: number = 1;

    if (searchStr.length > 0) {
      await api.get(`Produto/Procurar/${searchStr}?pagina=${pagina}`) // await api.get(`Produto/Procurar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.statusText === "OK") {
              console.log(res);
              setTableData(res.data.products);
              setIsActive(true);
              setError('');
            } else {
              setTableData([new Product]);
              setError(res.data.constraints.message);
            }
          }
        ).catch(
          (error) => {
            setError('Nenhum resultado encontrado');
            setTableData(null);
          }
        )
    } else {
      setError('Campo de pesquisa está vazio');
    }
  }

  const onClickButton = (url: string, event: any) => {
    router.push(url);
  }

  const handleKeyPress = (event: any) => {
    if (event.target.charCode == 13) {
      alert('Enter clicked!!!');
    }
  }

  return (
    <div className="pageContainer">
      <Head><title>Buscar Produto | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className={styles.productSearch}>
        <Container fluid>
          <Row>
            <Col xs={9} lg={10}>
              <SearchBox
                handleSearch={handleSearch}
                error={error}
              />
            </Col>
            <Col xs={3} lg={2}>
              <Button variant="primary" className={styles.createButton} onClick={(event) => onClickButton('/', event)}>
                <img src="/icons/add_circle_black_36dp.svg" alt="Adicionar" />
                <p>Cadastrar</p>
              </Button>
            </Col>
          </Row>
        </Container>
        {tableData ?
          <>
            <ProductTable products={tableData} />
          </>
          : ''
        }
      </div>
      <Footer />
    </div>
  );
}

export default ProductSearch;