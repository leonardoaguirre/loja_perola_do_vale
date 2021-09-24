import { useRouter } from 'next/router';
import styles from './styles.module.css';

interface MenuProps {

}

const Menu: React.FC<MenuProps> = (props) => {
  const router = useRouter();


  const goToPage = (url: string) => {
    
    if (url) {
      router.push(`http://localhost:3000/adm/manage/${url}`);
    }
  }

  return (
    <>
      <button className={styles.item} onClick={() => goToPage("products/search")}>Produtos</button>
      <button className={styles.item} onClick={() => goToPage("user/customer/search")}>Clientes</button>
      <button className={styles.item} onClick={() => goToPage("user/employee/search")}>Funcionários</button>
      <button className={styles.item} onClick={() => goToPage("providers/search")}>Fornecedores</button>
    </>
  );
}

export default Menu;