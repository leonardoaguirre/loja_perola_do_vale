import { request } from 'https';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import Footer from '../../../../../components/Footer';
import Header from '../../../../../components/Header';
import PaginationBar from '../../../../../components/PaginationBar';
import PaginationBarSR from '../../../../../components/PaginationBarSR';
import ProductTable from '../../../../../components/ProductTable';
import SearchBox from '../../../../../components/SearchBox';
import { Product } from '../../../../../models/Product';
import api from '../../../../../services/api';
import styles from './styles.module.css';

interface ProductSearchProps {
  search: string;
  nPages: number;
  activePage: number
}
interface searchProps {
  products: Product[];
  nPages: number;
}
const ProductSearch: React.FC<ProductSearchProps> = (props) => {
  const router = useRouter();

  // const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<searchProps>(null);
  const [error, setError] = useState<string>('');

  const [activePage, setActivePage] = useState(props.activePage ? props.activePage : 1)
  const [search, setSearch] = useState(props.search ? props.search : ``)

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      setSearch(searchStr)

      await api.get(`Produto/Procurar/${searchStr}?pagina=${activePage}`)
        .then(
          (res) => {
            if (res.statusText === "OK") {
              setTableData(res.data);
              // setIsActive(true);
              setError('');
            } else {
              setTableData({ products: [], nPages: 0 });
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

  useEffect(() => {
    if (search) handleSearch(search, ``)//faz a pesquisa somente quando o activePage muda
  }, [activePage])

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
              <Button variant="primary" className={styles.createButton} onClick={(event) => onClickButton('/adm/manage/products/form', event)}>
                <img src="/icons/add_circle_black_36dp.svg" alt="Adicionar" />
                <p>Cadastrar</p>
              </Button>
            </Col>
          </Row>
        </Container>
        {tableData ?
          <>
            <ProductTable products={tableData.products} />
            <Row>
              <PaginationBarSR nPages={tableData.nPages} activePage={activePage} onClick={(nPag) => { setActivePage(nPag); }} />
            </Row>
          </>
          : ''
        }
      </div>
      <Footer />
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pagina } = context.query;
  const { search } = context.params || ``;

  if (pagina && search) {
    let data;
    await api.get(`Produto/Procurar/${search}?pagina=${pagina}`)
      .then(res => {
        if (res.status === 200) data = res.data
        else if (res.status === 401) return { notFound: true }
      })
    // .catch(err => console.log(err))

    return {
      props: {
        products: data.products,
        nPages: data.nPages,
        search: search,
        activePage: pagina ? pagina : 1
      }
    }
  }
  return {
    props: {}
  }
}

export default ProductSearch;