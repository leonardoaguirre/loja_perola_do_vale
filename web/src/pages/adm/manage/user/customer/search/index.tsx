import Head from 'next/head';
import React, { useState } from 'react';

import Footer from '../../../../../../components/Footer';
import Header from '../../../../../../components/Header';
import SearchBox from '../../../../../../components/SearchBox';
import UserTable from '../../../../../../components/UserTable';
import { Customer } from '../../../../../../models/Customer';
import api from '../../../../../../services/api';
import styles from './styles.module.css';

interface PageUserProps {
  
}


const PageUser: React.FC<PageUserProps> = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Customer[]>(null);
  const [error, setError] = useState<string>('');

  // const reloadTable = async () => {
  //   const tokenCookie = Cookies.get("tokenCookie");

  //   const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

  //   const response = await fetch(`${environment.API}/Cliente/listar`, pessoa);

  //   setTableItens(await response.json());
  // }

  const filterOptions = [
    {value: "nome", viewValue: "Nome"}, 
    {value: "email", viewValue: "Email"}, 
    {value: "cpf", viewValue: "CPF"},
  ];

  const handleSearch = async (searchStr: string, atribute: string) => {
    if (searchStr.length > 0) {
      await api.get(`Cliente/Buscar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 201) {
              setTableData(res.data);
              setIsActive(true);
              setError('');
            } else {
              setTableData([new Customer]);
              setError(res.data.constraints.message);
            }
          }
        ).catch(
          (error) => {
            setError('Nenhum resultado encontrado');
            setTableData(null)
          }
        )
    } else {
      setError('Campo de pesquisa está vazio');
    }
  }

  return (
    <div className="pageContainer">
      <Head><title>Buscar Cliente | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className={styles.custumerSearch}>
        <SearchBox
          filterOptions={filterOptions}
          handleSearch={handleSearch}
          error={error}
        />
        {tableData ?
          <UserTable customers={tableData} />
          : ''
        }
      </div>
      <Footer />
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