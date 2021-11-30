import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';

import Header from '../../../../../components/Header';
import PaginationBarSR from '../../../../../components/PaginationBarSR';
import ProductTable from '../../../../../components/ProductTable';
import SearchBox from '../../../../../components/SearchBox';
import { Product } from '../../../../../models/Product';
import api from '../../../../../services/api';
import apiWithAuth from '../../../../../services/apiWithAuth';
import styles from './styles.module.css';

interface ProductSearchProps {
  search: string;
  nPages: number;
  activePage: number
}
interface SearchProps {
  products: Product[];
  nPages: number;
}
const ProductSearch: React.FC<ProductSearchProps> = (props) => {
  const router = useRouter();

  const [tableData, setTableData] = useState<SearchProps>(null);
  const [error, setError] = useState<string>('');

  const [activePage, setActivePage] = useState(props.activePage ? props.activePage : 1)
  const [search, setSearch] = useState(props.search ? props.search : ``)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      setIsLoading(true);
      setSearch(searchStr)
      await api.get(`Produto/Procurar/${searchStr}?pagina=${activePage}`)
        .then(
          (res) => {
            if (res.status === 200) {
              setTableData(res.data);
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
        ).finally(() => setIsLoading(false))
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

  return (
    <div className="pageContainer">
      <Head><title>Gerenciamento de Produtos | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h2>Gerenciamento de Produtos e Estoque</h2>
        <Container fluid>
          <Row className="pb-4">
            <Col xs={9} lg={10}>
              <SearchBox
                handleSearch={handleSearch}
                emitHandleInputChange={true}
                handleInputChange={setSearch}
                error={error}
                placeholder="Digite sua pesquisa aqui"
              />
            </Col>
            <Col xs={3} lg={2}>
              <Button variant="success" className={styles.createButton} onClick={(event) => onClickButton('/adm/manage/products/form', event)}>
                <MdAddCircle />
                <p>Cadastrar</p>
              </Button>
            </Col>
          </Row>
          {(isLoading ? (
            <Row>
              <Col className="d-flex justify-content-center pt-5" xs={12}>
                <Spinner id={styles.spinner} animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          ) : (
            (tableData ?
              <>
                <Row>
                  <ProductTable products={tableData.products} />
                </Row>
                <Row>
                  <PaginationBarSR nPages={tableData.nPages} activePage={activePage} onClick={(nPag) => { setActivePage(nPag) }} />
                </Row>
              </>
              : '')
          ))}
          {/* {tableData ?
            <>
              <Row>
                <ProductTable products={tableData.products} />
              </Row>
              <Row>
                <PaginationBarSR nPages={tableData.nPages} activePage={activePage} onClick={(nPag) => { setActivePage(nPag); }} />
              </Row>
            </>
            : ''
          } */}
        </Container>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenCookie } = context.req.cookies;

  if (!tokenCookie) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      }
    }
  }
  return await apiWithAuth(tokenCookie).get('Funcionario/Autorizar')
    .then(res => {
      return { props: {} }
    })
    .catch(err => {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    })
}
export default ProductSearch;