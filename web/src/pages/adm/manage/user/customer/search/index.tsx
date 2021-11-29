import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';

import Header from '../../../../../../components/Header';
import PaginationBarSR from '../../../../../../components/PaginationBarSR';
import SearchBox from '../../../../../../components/SearchBox';
import UserTable from '../../../../../../components/UserTable';
import { Customer } from '../../../../../../models/Customer';
import api from '../../../../../../services/api';
import styles from './styles.module.css';

interface CustomerSearchProps {
  customers: Customer[];
  search: string;
  atribute: string;
  nPages: number;
  activePage: number
}

interface SearchProps {
  customers: Customer[];
  nPages: number;
}

interface Filter {
  value: string;
  viewValue: string;
}

const CustomerSearch: React.FC<CustomerSearchProps> = (props) => {

  const router = useRouter();

  const [tableData, setTableData] = useState<SearchProps>(props.customers ? { customers: props.customers, nPages: props.nPages } : null);
  const [error, setError] = useState<string>('');

  const [activePage, setActivePage] = useState(props.activePage ? props.activePage : 1)
  const [search, setSearch] = useState(props.search ? props.search : ``)
  const [atribute, setAtribute] = useState<string>(props.atribute ? props.atribute : null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterOptions: Filter[] = [
    { value: "nome", viewValue: "Nome" },
    { value: "email", viewValue: "Email" },
    { value: "cpf", viewValue: "CPF" },
  ];

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      setIsLoading(true);
      await api.get(`Cliente/Buscar/${atribute}/${searchStr}?pagina=${activePage}`)
        .then(
          (res) => {
            if (res.status === 200) {
              setTableData(res.data);
              setError('');
            } else {
              setTableData({ customers: [], nPages: 0 });
              setError(res.data.constraints.message);
            }
          }
        ).catch(
          (error) => {
            setError('Nenhum resultado encontrado');
            setTableData(null)
          }
        ).finally(() => setIsLoading(false));
    } else {
      setError('Campo de pesquisa está vazio');
    }
  }

  useEffect(() => {
    if (search) handleSearch(search, atribute) // faz a pesquisa somente quando o activePage muda
  }, [activePage])


  const onClickButton = (url: string, event: any) => {
    router.push(url);
  }

  return (
    <div className="pageContainer">
      <Head><title>Buscar Cliente | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h2>Gerenciamento de Clientes</h2>
        <Container fluid>
          <Row className="pb-4">
            <Col xs={9} lg={10}>
              <SearchBox
                filterOptions={filterOptions}
                handleSearch={handleSearch}
                emitHandleInputChange={true}
                handleInputChange={setSearch}
                handleSelectChange={setAtribute}
                error={error}
                placeholder="Digite sua pesquisa aqui"
              />
            </Col>
            <Col xs={3} lg={2}>
              <Button variant="success" className={styles.createButton} onClick={(event) => onClickButton('/adm/manage/user/customer/form', event)}>
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
                  <UserTable customers={tableData.customers} />
                </Row>
                <Row>
                  <PaginationBarSR nPages={tableData.nPages} activePage={activePage} onClick={(nPag) => { setActivePage(nPag) }} />
                </Row>
              </>
              : '')
          ))}
        </Container>
      </div>
    </div >
  );
}


// export const getServerSideProps: GetServerSideProps = async (context) => {

//   const { tokenCookie } = context.req.cookies;

//   const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

//   const response = await fetch(`${environment.API}/Cliente/Listar`, pessoa);




//   if (response.status == 200) {
//     const data = await response.json();
//     return {
//       props: {
//         pessoas: data,
//       }
//     }
//   } else if (response.status == 400) {
//     const data = await response.json();
//     return {
//       props: {
//         pessoas: data,
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
// }

export default CustomerSearch;