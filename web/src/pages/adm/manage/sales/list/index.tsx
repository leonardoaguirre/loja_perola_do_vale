import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import Footer from "../../../../../components/Footer";
import Header from "../../../../../components/Header";
import PaginationBar from "../../../../../components/PaginationBar";
import SaleResume from "../../../../../components/SaleResume";
import SearchBox from "../../../../../components/SearchBox";
import { Order } from "../../../../../models/Order";
import api from "../../../../../services/api";
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
            <Container>
                <Row>
                    <Col >
                        <div className={styles.pageTitle}>
                            <h1>Gerenciamento de Vendas</h1>
                        </div>
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
                    </Col>
                </Row >
                <Row>
                    <PaginationBar nPages={props.nPages} search={``} destination={'adm/manage/sales/list'} activePage={props.activePage} />
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs={9} xl={6} sm={10} md={9} lg={8}>
                        <div className={styles.pageTitle}>
                            <h1>Pesquisa de Vendas</h1>
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
                        {searchData ?
                            searchData.map((venda, i) => {
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
                                                        <Button variant="primary" onClick={() => onChangeShowSearchData(i, true)}>Mostrar</Button>
                                                    </Col>
                                                </Row>
                                                {showSearchDataResume[i] ?
                                                    <SaleResume order={venda} show={showSearchDataResume[i]} onClose={(show: boolean) => onChangeShowSearchData(i, show)} /> : ``
                                                }
                                            </Alert>
                                        </a>
                                    </div>
                                )
                            })
                            : ``
                        }
                    </Col>
                </Row>
            </Container>
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