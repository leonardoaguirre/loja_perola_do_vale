import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/components/ProductsTable.module.css';

function UserTable({ users }) {
    const deleteUser = async (event) => {
        event.preventDefault()
        console.log(event.target.value);
        await fetch('http://localhost:3008/Pessoa/Deletar', {
            body: JSON.stringify({
                id: event.target.value,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: "DELETE",
        })
        .then(async (res) => {
            const result = await res.json();
            // result.user => 'Ada Lovelace'
            console.log(result);
            // return {
            //     props: { retorno: result, },
            // }
        }).catch((err) => console.log(err))


    }
    return (
        <div className={styles.productsTable}>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Rg</th>
                        <th>CPF</th>
                        <th>Data de Nascimennto</th>
                        <th>Email</th>
                        <th>Alterar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, key) => (
                        <tr key={key}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.rg}</td>
                            <td>{user.cpf}</td>
                            <td>{user.dtNasc}</td>
                            <td>{user.email}</td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href="/userForm?id='{user.id}'">
                                        <button className={styles.updateButton}>Alterar</button>
                                    </Link>
                                </div>
                            </td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href="">
                                        <button className={styles.deleteButton} onClick={deleteUser} value={user.id}>Excluir</button>
                                    </Link>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
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