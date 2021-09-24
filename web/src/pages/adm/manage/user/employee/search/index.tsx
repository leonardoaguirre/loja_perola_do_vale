import styles from './styles.module.css';
import { useState } from 'react';
import api from '../../../../../../services/api';
import Header from '../../../../../../components/Header/index';
import SearchBox from '../../../../../../components/SearchBox';
import Footer from '../../../../../../components/Footer/index';
import { Employee } from '../../../../../../models/Employee';
import UserTable from '../../../../../../components/UserTable';
import EmployeeTable from '../../../../../../components/EmployeeTable/index';


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

  const handleSearch = async (event: any, searchStr: string, atribute: string) => {
    event.preventDefault();

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
    <div className={styles.container} onClick={teste}>
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