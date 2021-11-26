import { GetServerSideProps } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Footer from "../../../../../components/Footer";
import Header from "../../../../../components/Header";
import SaleResume from "../../../../../components/SaleResume";
import { Order } from "../../../../../models/Order";
import api from "../../../../../services/api";

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
            <Row>
                <Col>
                    <Row>
                        Gerenciamento de Vendas
                    </Row>
                    <Row>
                        {props.vendas.map((venda, i) => {
                            return (
                                <div key={i}>
                                    <a key={i}>
                                        <Alert key={i} variant='secondary'>
                                            <Row>
                                                <Col>
                                                    Venda #{venda.id}
                                                </Col>
                                                <Col>
                                                    Status : {venda.status}
                                                </Col>
                                                <Col>
                                                    Data da compra: {new Date(venda.dtCompra).toLocaleDateString()}
                                                </Col>
                                                <Col>
                                                    <Button variant="primary" onClick={() => onChangeShowSale(i, true)}>Mostrar</Button>
                                                </Col>
                                            </Row>
                                            {showSaleResume[i] ?
                                                <SaleResume order={venda} show={showSaleResume[i]} onClose={(show: boolean) => onChangeShowSale(i, show)} /> : ``
                                            }
                                        </Alert>
                                    </a>
                                </div>
                            )
                        })
                        }
                    </Row>
                </Col>
            </Row >
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