import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';

import Header from '../../../../../components/Header';
import PaginationBarSR from '../../../../../components/PaginationBarSR';
import ProviderTable from '../../../../../components/ProviderTable';
import SearchBox from '../../../../../components/SearchBox';
import { Provider } from '../../../../../models/Provider';
import api from '../../../../../services/api';
import styles from './styles.module.css';

interface PageUserProps {
  providers: Provider[];
}

interface SearchProps {
  providers: Provider[];
  nPages: number;
}

const PageUser: React.FC<PageUserProps> = (props) => {

  const router = useRouter();

  const [tableData, setTableData] = useState<SearchProps>(null);
  const [error, setError] = useState<string>('');

  const [activePage, setActivePage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [atribute, setAtribute] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterOptions = [
    { value: "nome", viewValue: "Nome Fantasia" },
    { value: "email", viewValue: "Email" },
    { value: "cnpj", viewValue: "CNPJ" },
  ];

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      setIsLoading(true);
      await api.get(`Fornecedor/Buscar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 201) {
              setTableData(res.data);
              setError('');
            } else {
              setTableData({ providers: [], nPages: 0 });
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
      <Head><title>Buscar Fornecedores | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h2>Gerenciamento de Fornecedores</h2>
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
                  <ProviderTable providers={tableData.providers} />
                </Row>
                <Row>
                  <PaginationBarSR nPages={tableData.nPages} activePage={activePage} onClick={setActivePage} />
                </Row>
              </>
              : '')
          ))}
        </Container>
      </div>
    </div>
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
export default PageUser;