import { GetStaticProps} from 'next';
import styles from '../styles/components/ProductsTable.module.css';

function UserTable({ users}) {
    return (
        <div className={styles.productsTable}>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Rg</th>
                    <th>CPF</th>
                    <th>Data de Nascimennto</th>
                    <th>Email</th>
                </tr>
                {users.map((user, key) => (
                <tr>
                    <td>{user.id}</td>
                    <td>{user.nome}</td>
                    <td>{user.rg}</td>
                    <td>{user.cpf}</td>
                    <td>{user.dtNasc}</td>
                    <td>{user.email}</td>
                </tr>
               ))}
            </table>
        </div>
    )
}

// export const getStaticProps : GetStaticProps = async () => {
//     const response = await fetch("http://localhost:3008/pessoa/listar")
//     const data = await response.json();
//     return {
//         props: {users: data,},
//         revalidate: 0
//     }
// }
export default UserTable;