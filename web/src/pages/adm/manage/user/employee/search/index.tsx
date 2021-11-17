import Head from 'next/head';
import { useState } from 'react';

import EmployeeTable from '../../../../../../components/EmployeeTable';
import Footer from '../../../../../../components/Footer';
import Header from '../../../../../../components/Header';
import SearchBox from '../../../../../../components/SearchBox';
import { Employee } from '../../../../../../models/Employee';
import api from '../../../../../../services/api';
import styles from './styles.module.css';

interface EmployeeSearchProps {

}

const EmployeeSearch: React.FC<EmployeeSearchProps> = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Employee[]>(null);
  const [error, setError] = useState<string>('');

  const filterOptions = [
    {value: "nome", viewValue: "Nome"}, 
    {value: "email", viewValue: "Email"}, 
    {value: "cpf", viewValue: "CPF"},
  ];

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      await api.get(`Funcionario/Buscar/${atribute}/${searchStr}`) // await api.get(`Produto/Procurar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 201) {
              setTableData(res.data);
              setIsActive(true);
              setError('');
            } else {
              setTableData([new Employee]);
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

  const teste = () => {
    console.log(tableData);
  }

  return (
    <div className="pageContainer" onClick={teste}>
      <Head><title>Buscar Colaborador | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className={styles.employeeSearch}>
        <SearchBox
          filterOptions={filterOptions}
          handleSearch={handleSearch}
          error={error}
        />
        {tableData ?
          <EmployeeTable employees={tableData} />
          : ''
        }
      </div>
      <Footer />
    </div>
  );
}

export default EmployeeSearch;