import Header from '../../../../../components/Header';
import Footer from '../../../../../components/Footer';
import ProductTable from '../../../../../components/ProductTable';

import styles from './styles.module.css';
import { useState } from 'react';
import api from '../../../../../services/api';
import SearchBox from '../../../../../components/SearchBox';
import { Product } from '../../../../../models/Product';

interface ProductSearchProps {

}

const ProductSearch: React.FC<ProductSearchProps> = (props) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Product[]>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async (event: any, searchStr: string, atribute: string) => {
    event.preventDefault();

    if (searchStr.length > 0) {
      await api.get(`Produto/Procurar/${searchStr}`) // await api.get(`Produto/Procurar/${atribute}/${searchStr}`)
        .then(
          (res) => {
            if (res.status === 200) {
              setTableData(res.data);
              setIsActive(true);
              setError('');
            } else {
              setTableData([new Product]);
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

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.productSearch}>
        <SearchBox
          handleSearch={handleSearch}
          error={error}
        />
        {tableData ?
          <ProductTable products={tableData} />
          : ''
        }
      </div>
      <Footer />
    </div>
  );
}

export default ProductSearch;