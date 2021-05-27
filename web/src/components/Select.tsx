import styles from '../styles/components/Select.module.css';

interface SelectProps {
    name: string;
}

const Select: React.FC<SelectProps> = (props) => {
    

    return (
        <div className={styles.customSelect}>
            <select name={props.name}>
                <option value="valor0">Selecione uma categoria</option>
                <option value="valor1">Eletrônico</option>
                <option value="valor2">Ferramenta</option>
                <option value="valor3">Motor</option>
            </select>
        </div>
    );
}

export default Select;