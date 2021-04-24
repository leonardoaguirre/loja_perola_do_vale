import { Button } from '@material-ui/core';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../styles/components/UserTable.module.css';

// var table = document.getElementById("table");
// var lines = table.getElementsByTagName("tr");

// for (var i = 0; i < lines.length; i++) {
//     var line = lines[i];

//     line.addEventListener("click", function () {
//         selectLine(this, false);
//     });
// }

// function selectLine(line, multiples) {
//     if (!multiples) {
//         var lines = line.parentElement.getElementsByTagName("tr");
//         for (var i = 0; i < lines.length; i++) {
//             var line_ = lines[i];
//             line_.classList.remove(styles.selected);
//         }
//     }
//     line.classList.toggle(styles.selected);
// }



interface UserProps {
    id : string,
    nome: string,
    rg: string,
    cpf: string,
    dtNasc: string,
    email: string,
    senha: string
}

interface UserTableProps {
    users: [UserProps];
}

const UserTable: React.FC<UserTableProps> = (props) => {

    const cliquei = async (event) => {
        console.log("cliquei na tr")
    }
    
    const alterUser = async (event) => {
        event.preventDefault()
    }

    const deleteUser = async (event, userid) => {
        event.preventDefault()

        console.log(event.target.key);
        await fetch('http://localhost:3008/Pessoa/Deletar', {
            body: JSON.stringify({
                id: userid,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
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
        <div className={styles.usersTable}>
            <table id="table" className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Rg</th>
                        <th>CPF</th>
                        <th>Data de Nascimennto</th>
                        <th>Email</th>
                        <th>Senha</th>
                        <th>Alterar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user, key) => (
                        <tr key={key} onClick={cliquei}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.rg}</td>
                            <td>{user.cpf}</td>
                            <td>{user.dtNasc}</td>
                            <td>{user.email}</td>
                            <td>{user.senha}</td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href={`/userForm/alter/${user.id}`}>
                                        <a><button className={styles.updateButton}>Alterar</button></a>
                                    </Link>
                                </div>
                            </td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href="/userForm">
                                        <a><button className={styles.deleteButton} onClick={(event) => deleteUser(event, user.id)}>Excluir</button></a>
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