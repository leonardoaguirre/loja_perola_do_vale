import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';

import Header from '../../../../../components/Header';
import PaginationBar from '../../../../../components/PaginationBar';
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
const ListSales: React.FC<ListSaleProps> = (props) => {
  const [showSaleResume, setShowSaleResume] = useState<boolean[]>([])

  const [error, setError] = useState<string>('');
  const [searchData, setSearchData] = useState<Order[]>([])
  const [showSearchDataResume, setShowSearchDataResume] = useState<boolean[]>([])

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

    api.get(`Venda/Pesquisar?atributo=${atribute}&pesquisa=${searchStr}`)
      .then((res) => {
        setSearchData(res.data)
        setError(``)
      }).catch(err => {
        setError(`Nenhuma venda foi encontrada`)
        setSearchData([])
      })
  }

  return (
    <div className="pageContainer">
      <Head><title>Minha Conta | Ferragens Pérola do Vale</title></Head>
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
                        <td><Button className="w-100 h-100" variant="secondary" onClick={() => onChangeShowSale(i, true)}>Mostrar</Button></td>

                        {showSaleResume[i] ?
                          <SaleResume order={venda} show={showSaleResume[i]} onClose={(show: boolean) => onChangeShowSale(i, show)} /> : ``
                        }
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
          <Row>
            <Col className="pb-4" xs={12} sm={6} lg={5}>
              <div className={styles.pageTitle}>
                <h3>Pesquisa de Vendas</h3>
              </div>
              <SearchBox
                handleSearch={handleSearch}
                error={error}
                filterOptions={[
                  { value: 'id', viewValue: 'Id' },
                  { value: 'email', viewValue: 'Email' },
                  { value: 'dtCompra', viewValue: 'Data de compra' },
                ]}
              />
            </Col>
            <Col xs={12}>
              {(searchData.length > 0 ? (
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
                    {searchData.map((venda, i) => {
                      return (
                        <tr key={i}>
                          <td>{venda.id}</td>
                          <td>{venda.status}</td>
                          <td>{new Date(venda.dtCompra).toLocaleDateString()}</td>
                          <td><Button className="w-100 h-100" variant="secondary" onClick={() => onChangeShowSale(i, true)}>Mostrar</Button></td>

                          {showSaleResume[i] ?
                            <SaleResume order={venda} show={showSaleResume[i]} onClose={(show: boolean) => onChangeShowSale(i, show)} /> : ``
                          }
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              ) : (
                ''
              ))}
            </Col>
          </Row>
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