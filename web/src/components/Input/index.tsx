import { Button, FormControl, InputGroup } from "react-bootstrap";

import styles from './styles.module.css';

interface InputProps {
  handleInputChange(value: string): void;
  handleSubmit(): void;
  placeholder: string;
}

const Input: React.FC<InputProps> = (props) => {

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.charCode == 13) {
      props.handleSubmit();
    }
  }

  return (
    <InputGroup className={styles.inputContainer} size="lg" onKeyPress={(event) => handleKeyPress(event.nativeEvent)} >
      <FormControl
        className={styles.searchInput}
        onChange={(event) => props.handleInputChange(event.target.value)}
        placeholder={props.placeholder}
        aria-label="Large"
        aria-describedby="inputGroup-sizing-sm"
      />
      <Button className={styles.searchButton} variant="light" id="button-addon2" onClick={props.handleSubmit}>
        <img
          src="/icons/search-black-36dp.svg"
          alt="Lupa"
          title="Buscar"
        />
      </Button>
    </InputGroup>
  );
}

export default Input;