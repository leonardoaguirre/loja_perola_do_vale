import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap';

import Header from '../../../../../components/Header';
import PaginationBar from '../../../../../components/PaginationBar';
import PaginationBarSR from '../../../../../components/PaginationBarSR';
import SaleResume from '../../../../../components/SaleResume';
import SearchBox from '../../../../../components/SearchBox';
import { Order } from '../../../../../models/Order';
import api from '../../../../../services/api';
import styles from './styles.module.css';

interface ListSaleProps {
  vendas: Order[];
  search: string;
  nPages: number;
  activePage: number;
}

interface SearchData {
  orders: Order[];
  nPages: number;
}

const ListSales: React.FC<ListSaleProps> = (props) => {
  const [showSaleResume, setShowSaleResume] = useState<boolean[]>([])

  const [error, setError] = useState<string>('');
  const [searchData, setSearchData] = useState<SearchData>({ orders: [], nPages: 0 })
  const [showSearchDataResume, setShowSearchDataResume] = useState<boolean[]>([])

  const [activePageSearch, setActivePageSearch] = useState<number>(1)
  const [search, setSearch] = useState(``)
  const [atribute, setAtribute] = useState<string>(null);
  const [isLoadingSR, setIsLoadingSR] = useState<boolean>(false);

  useEffect(() => {
    if (search) handleSearch(search, atribute)
  }, [activePageSearch])

  const onChangeShowSale = (i: number, state: boolean) => {
    let show: boolean[] = []
    show = showSaleResume.map(item => item)
    show[i] = state

    setShowSaleResume(show)
  }

  const onChangeShowSearchData = (i: number, state: boolean) => {
    let s: boolean[] = []
    s = showSearchDataResume.map(item => item)
    s[i] = state

    setShowSearchDataResume(s)
  }

  const handleSearch = (searchStr: string, atribute: string) => {
    setIsLoadingSR(true);
    api.get(`Venda/Pesquisar?atributo=${atribute}&pesquisa=${searchStr}&pagina=${activePageSearch}`)
      .then((res) => {
        setSearchData({ orders: res.data.vendas, nPages: res.data.nPages })
        setError(``)
      }).catch(err => {
        setError(`Nenhuma venda foi encontrada`)
        setSearchData({ orders: [], nPages: 0 })
      }).finally(() => setIsLoadingSR(false))
  }

  return (
    <div className="pageContainer">
      <Head><title>Gerenciamento de Vendas | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h2>Gerenciamento de Vendas</h2>
        <Container fluid>
          <Row>
            <Col>
              <Table id={styles.table} striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Data da compra</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {props.vendas.map((venda, i) => {
                    return (
                      <tr key={i}>
                        <td>{venda.id}</td>
                        <td>{venda.status}</td>
                        <td>{new Date(venda.dtCompra).toLocaleDateString()}</td>
                        <td>
                          <Button className="w-100 h-100" variant="secondary" onClick={() => onChangeShowSale(i, true)}>Mostrar</Button>
                          {showSaleResume[i] ?
                            <SaleResume order={venda} show={showSaleResume[i]} onClose={(show: boolean) => onChangeShowSale(i, show)} /> : ``
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <PaginationBar nPages={props.nPages} search={``} destination={'adm/manage/sales/list'} activePage={props.activePage} />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="pb-4" xs={12} sm={6} lg={5}>
              <div className={styles.pageTitle}>
                <h3>Pesquisa de Vendas</h3>
              </div>
              <SearchBox
                handleSearch={handleSearch}
                handleInputChange={setSearch}
                emitHandleInputChange={true}
                error={error}
                filterOptions={[
                  { value: 'id', viewValue: 'Id' },
                  { value: 'email', viewValue: 'Email' },
                  { value: 'dtCompra', viewValue: 'Data de compra' },
                ]}
                handleSelectChange={setAtribute}
              />
            </Col>
          </Row>
          {(isLoadingSR ? (
            <Row>
              <Col className="d-flex justify-content-center pt-5" xs={12}>
                <Spinner id={styles.spinner} animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          ) : (
            (searchData.orders.length > 0 ? (
              <Row>
                <Col xs={12}>
                  <Table id={styles.table} responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Data da compra</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchData.orders.map((venda, i) => {
                        return (
                          <tr key={i}>
                            <td>{venda.id}</td>
                            <td>{venda.status}</td>
                            <td>{new Date(venda.dtCompra).toLocaleDateString()}</td>
                            <td>
                              <Button className="w-100 h-100" variant="secondary" onClick={() => onChangeShowSale(i, true)}>Mostrar</Button>
                              {showSaleResume[i] ?
                                <SaleResume order={venda} show={showSaleResume[i]} onClose={(show: boolean) => onChangeShowSale(i, show)} /> : ``
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={12}>
                  <PaginationBarSR nPages={searchData.nPages} activePage={activePageSearch} onClick={(nPag) => { setActivePageSearch(nPag) }} />
                </Col>
              </Row>
            ) : (
              ''
            ))
          ))}
        </Container>
      </div>
    </div >
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.req.cookies;
  const { pagina } = context.query;

  let data;
  await api.get(`Venda/ListarVendas?pagina=${pagina}`)
    .then(res => {
      if (res.status === 200) data = res.data
      else if (res.status === 401) return { notFound: true }
    })
    .catch(err => console.log(err))

  return {
    props: {
      vendas: data.vendas,
      nPages: data.nPages,
      activePage: pagina ? pagina : 1
    }
  }
}
export default ListSales;