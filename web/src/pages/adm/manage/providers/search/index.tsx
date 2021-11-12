import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

import styles from './styles.module.css';
import { Provider } from '../../../../../models/Provider';
import api from '../../../../../services/api';
import Header from '../../../../../components/Header/index';
import Footer from '../../../../../components/Footer/index';
import SearchBox from '../../../../../components/SearchBox/index';
import ProviderTable from '../../../../../components/ProviderTable/index';

interface PageUserProps {
  providers: Provider[];
}

const PageUser: React.FC<PageUserProps> = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Provider[]>(null);
  const [error, setError] = useState<string>('');

  // const reloadTable = async () => {
  //   const tokenCookie = Cookies.get("tokenCookie");

  //   const pessoa = { headers: { 'authorization': tokenCookie }, method: "GET" };

  //   const response = await fetch(`${environment.API}/Cliente/listar`, pessoa);

  //   setTableItens(await response.json());
  // }

  const filterOptions = [
    {value: "nomeFantasia", viewValue: "Nome Fantasia"}, 
    {value: "email", viewValue: "Email"}, 
    {value: "cnpj", viewValue: "CNPJ"},
  ];

  const handleSearch = async (event: any, searchStr: string, atribute: string) => {
    event.preventDefault();

    if (searchStr.length > 0) {
      await api.get(`Fornecedor/Buscar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 201) {
              setTableData(res.data);
              setIsActive(true);
              setError('');
            } else {
              setTableData([new Provider]);
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
    <div className={styles.container}>
      <Header />
      <div className={styles.providerSearch}>
        <SearchBox
          filterOptions={filterOptions}
          handleSearch={handleSearch}
          error={error}
        />
        {tableData ?
          <ProviderTable providers={tableData} />
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