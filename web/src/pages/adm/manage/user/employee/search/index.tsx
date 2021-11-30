import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';

import EmployeeTable from '../../../../../../components/EmployeeTable';
import Header from '../../../../../../components/Header';
import PaginationBarSR from '../../../../../../components/PaginationBarSR';
import SearchBox from '../../../../../../components/SearchBox';
import { Employee } from '../../../../../../models/Employee';
import api from '../../../../../../services/api';
import styles from './styles.module.css';

interface EmployeeSearchProps {

}
interface SearchProps {
  employees: Employee[];
  nPages: number;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = (props) => {

  const router = useRouter();

  const [tableData, setTableData] = useState<SearchProps>(null);
  const [error, setError] = useState<string>('');

  const [activePage, setActivePage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [atribute, setAtribute] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterOptions = [
    { value: "nome", viewValue: "Nome" },
    { value: "email", viewValue: "Email" },
    { value: "cpf", viewValue: "CPF" },
  ];

  useEffect(() => {
    if (search) handleSearch(search, atribute) // faz a pesquisa somente quando o activePage muda
  }, [activePage])

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      setIsLoading(true);
      await api.get(`Funcionario/Buscar/${atribute}/${searchStr}`) // await api.get(`Produto/Procurar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 200) {
              setTableData(res.data);
              setError('');
            } else {
              setTableData({ employees: [], nPages: 0 });
              setError(res.data.constraints.message);
            }
          }
        ).catch(
          (error) => {
            setError('Nenhum resultado encontrado');
            setTableData(null);
          }
        ).finally(() => setIsLoading(false));
    } else {
      setError('Campo de pesquisa está vazio');
    }
  }

  const onClickButton = (url: string, event: any) => {
    router.push(url);
  }

  return (
    <div className="pageContainer">
      <Head><title>Buscar Colaborador | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        {console.log(tableData)}

        <h2>Gerenciamento de Funcionários</h2>
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
              <Button variant="success" className={styles.createButton} onClick={(event) => onClickButton('/adm/manage/user/employee/form', event)}>
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
                  <EmployeeTable employees={tableData.employees} />
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

export default EmployeeSearch;