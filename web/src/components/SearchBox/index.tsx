import api from '../../services/api';
import { Customer } from '../../models/Customer';
import { useState, useEffect } from 'react';

import styles from './styles.module.css';

interface SearchBoxProps {
  filterOptions?: Options[];
  handleSearch(event: any, searchStr: string, atribute: string): void;
  error: any;
  // passInformation(tableData?: Customer[], error?: any, isActive?: boolean): void;
}

interface Options {
  value: string;
  viewValue: string;
}


const SearchBox: React.FC<SearchBoxProps> = (props) => {

  // const [isActive, setIsActive] = useState<boolean>(false);
  const [atribute, setAtribute] = useState(props.filterOptions ? props.filterOptions[0].value : null);
  const [searchStr, setSearchStr] = useState('');
  // const [tableData, setTableData] = useState<Customer[]>();


  // useEffect(() => {
  //   props.passInformation(tableData, error, isActive);
  // },[error])

  return (
    <div className={styles.search}>
      <div className={styles.filters}>
        {props.filterOptions ?
          <select value={atribute} onChange={(event) => setAtribute(event.target.value)}>
            {props.filterOptions.map((option, index) => {
              return <option key={index} value={option.value}>{option.viewValue}</option>
            })}
          </select>
          : ''
        }
        <div className={styles.search}>
          <input type="search" value={searchStr} onChange={(event) => setSearchStr(event.target.value)} placeholder="Digite aqui sua pesquisa..." autoComplete="off" />
          <button onClick={(event) => props.handleSearch(event, searchStr, atribute)} className={styles.searchButton}>
            Buscar
          </button>
          {props.error != '' ? props.error : ''}
        </div>
      </div>
    </div>
  )
}

export default SearchBox;