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



interface ClientTableProps {
    clients: Client[];
    reload: () => void;
}

interface Client {
    id: string,
    pessoaFisica: PessoaFisica,
}

interface PessoaFisica {
    nome: string,
    rg: string,
    cpf: string,
    dtNasc: string,
    pessoa: Pessoa,
}

interface Pessoa {
    email: string,
}


const UserTable: React.FC<ClientTableProps> = (props) => {

    const cliquei = async (event) => {
        const linha: HTMLElement = event.target.parentNode;
        
        linha.className = `${styles.selected}`;
    }

    const alterUser = async (event) => {
        event.preventDefault()
    }

    const deleteUser = async (event, userid) => {
        event.preventDefault()

        console.log(event.target.key);
        await fetch('http://localhost:3008/Cliente/Deletar', {
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
                props.reload();
                // return {
                //     props: { retorno: result, },
                // }
            }).catch((err) => console.log(err))
    }

    return (
        <div className={styles.clientTable}>
            <table id="table" className={styles.table} onClick={cliquei}>
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
                    {props.clients.map((client, key) => (
                        <tr key={key}>
                            <td>{client.id}</td>
                            <td>{client.pessoaFisica.nome}</td>
                            <td>{client.pessoaFisica.rg}</td>
                            <td>{client.pessoaFisica.cpf}</td>
                            <td>{client.pessoaFisica.dtNasc}</td>
                            <td>{client.pessoaFisica.pessoa.email}</td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href={`/userForm/alter/${client.id}`}>
                                        <a><button className={styles.updateButton}>Alterar</button></a>
                                    </Link>
                                </div>
                            </td>
                            <td>
                                <div className={styles.buttonContainer}>
                                    <Link href="/userForm">
                                        <a><button className={styles.deleteButton} onClick={(event) => deleteUser(event, client.id)}>Excluir</button></a>
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
//         props: {client: Client,},
//         revalidate: 0
//     }
// }
export default UserTable;