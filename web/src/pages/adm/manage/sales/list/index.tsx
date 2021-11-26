import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import Footer from '../../../../../components/Footer';
import Header from '../../../../../components/Header';
import SaleResume from '../../../../../components/SaleResume';
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

  const onChangeShowSale = (i: number, state: boolean) => {
    let sales: boolean[] = []
    sales = showSaleResume.map(item => item)
    sales[i] = state

    setShowSaleResume(sales)
  }

  return (
    <div className="pageContainer">
      <Head><title>Minha Conta | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h2>Lista de Vendas</h2>
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
                <tr>
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
      </div>
      <Footer />
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