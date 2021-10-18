import api from '../../services/api';
import { Customer } from '../../models/Customer';
import { useState, useEffect } from 'react';

import styles from './styles.module.css';
import Input from '../Input';

interface SearchBoxProps {
  filterOptions?: Options[];
  handleSearch(searchStr: string, atribute: string): void;
  error: any;
}

interface Options {
  value: string;
  viewValue: string;
}


const SearchBox: React.FC<SearchBoxProps> = (props) => {

  const [atribute, setAtribute] = useState(props.filterOptions ? props.filterOptions[0].value : null);
  const [searchStr, setSearchStr] = useState('');

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
        {/* <div className={styles.inputContainer}>
          <input type="search" value={searchStr} onChange={(event) => setSearchStr(event.target.value)} placeholder="Digite aqui sua pesquisa..." autoComplete="off" />
          <button onClick={(event) => props.handleSearch(event, searchStr, atribute)} className={styles.searchButton}>
            Buscar
          </button>
          {props.error != '' ? props.error : ''}
        </div> */}
        <Input
          handleInputChange={(value) => setSearchStr(value)}
          handleSubmit={() => props.handleSearch(searchStr, atribute)}
          placeholder="Digite aqui sua pesquisa"
        />
        <p>{props.error != '' ? props.error : ''}</p>
      </div>
    </div>
  )
}

export default SearchBox;