import { useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

import styles from './styles.module.css';

interface SearchBoxProps {
  filterOptions?: Options[];
  handleSearch(searchStr: string, atribute: string): void;
  error: any;
  handleInputChange?: (value: string) => void;
  handleSelectChange?: (value: string) => void;
  emitHandleInputChange?: boolean;
  placeholder?: string;
}

interface Options {
  value: string;
  viewValue: string;
}


const SearchBox: React.FC<SearchBoxProps> = (props) => {

  const [atribute, setAtribute] = useState(props.filterOptions ? props.filterOptions[0].value : null);
  const [searchStr, setSearchStr] = useState('');

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.charCode == 13) {
      props.handleSearch(searchStr, atribute);
    }
  }

  useEffect(() => {
    if (props.emitHandleInputChange) {
      props.handleInputChange(searchStr);
    }
  }, [searchStr])

  useEffect(() => {
    if (props.filterOptions) {
      props.handleSelectChange(atribute);
    }
  }, [atribute])

  return (
    <div className={styles.search}>
      <div className={styles.filters}>
        <InputGroup className={styles.inputContainer} size="lg" onKeyPress={(event) => handleKeyPress(event.nativeEvent)} >
          {(props.filterOptions ? (
            <InputGroup.Text>
              <select value={atribute} onChange={(event) => setAtribute(event.target.value)}>
                {props.filterOptions.map((option, index) => {
                  return <option key={index} value={option.value}>{option.viewValue}</option>
                })}
              </select>
            </InputGroup.Text>
          ) : (
            ''
          ))}
          <FormControl
            className={styles.searchInput}
            onChange={(event) => setSearchStr(event.target.value)}
            placeholder={props.placeholder ? props.placeholder : "Digite sua pesquisa aqui"}
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
          />
          <Button className={styles.searchButton} variant="light" id="button-addon2" onClick={() => props.handleSearch(searchStr, atribute)}>
            <img
              src="/icons/search-black-36dp.svg"
              alt="Lupa"
              title="Buscar"
            />
          </Button>
        </InputGroup>
        <p>{props.error != '' ? props.error : ''}</p>
      </div>
    </div>
  )
}

export default SearchBox;