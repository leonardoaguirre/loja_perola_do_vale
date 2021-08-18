import Link from "next/link";
import React, { useState } from "react";

import styles from "../styles/components/UserTable.module.css";


interface ClientTableProps {
    clients: Client[];
    reload: () => void;
}

interface Client {
    id: string;
    pessoaFisica: PessoaFisica;
}

interface PessoaFisica {
    nome: string;
    rg: string;
    cpf: string;
    dtNasc: string;
    pessoa: Pessoa;
}

interface Pessoa {
    email: string;
}

const UserTable: React.FC<ClientTableProps> = (props) => {
    const [lineSelected, setLineSelected] = useState(null);

    const selecionaLinha = async (event) => {
        const linha: HTMLElement = event.target.parentNode;

        if (linha.tagName == "TR") {
            if (!linha.className) {
                if (lineSelected) {
                    document
                        .getElementsByClassName(`${styles.selected}`)[0]
                        .removeAttribute("class");
                }
                linha.className += ` ${styles.selected}`;
                setLineSelected(linha);
            } else {
                linha.removeAttribute("class");
                setLineSelected(null);
            }
        }
    };

    const removeLinha = async (trIndex: number) => {
        var el: any = document.getElementById("table");
        el.deleteRow(trIndex);
        setLineSelected(null);
    };

    const alterUser = async (event) => {
        event.preventDefault();
    };

    const deleteUser = async (userid: string, trIndex: number) => {
        await fetch("http://localhost:3008/Cliente/Deletar", {
            body: JSON.stringify({
                id: userid,
            }),
            headers: new Headers({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }),
            method: "DELETE",
        }).then(async (res) => {
            const result = await res.json();
            if (res.ok) {
                removeLinha(trIndex);
            } else {
                throw res;
            }
            
            // result.user => 'Ada Lovelace'
            // return {
            //     props: { retorno: result, },
            // }
        }).catch((err) => console.log(err));
    };

    return (
        <div className={styles.clientTable}>
            <table id="table" className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Rg</th>
                        <th>CPF</th>
                        <th>Data de Nascimennto</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody onClick={selecionaLinha}>
                    {props.clients.map((client, index) => (
                        <tr key={index}>
                            <td>{client.pessoaFisica.nome}</td>
                            <td>{client.pessoaFisica.rg}</td>
                            <td>{client.pessoaFisica.cpf}</td>
                            <td>{client.pessoaFisica.dtNasc}</td>
                            <td>{client.pessoaFisica.pessoa.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.actionsContainer}>
                <div className={styles.buttonContainer}>
                    <button
                        id="deletebtn"
                        className={styles.deleteButton}
                        onClick={() =>
                            deleteUser(props.clients[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)
                        }
                        disabled={!lineSelected}
                    >
                        Excluir
                    </button>
                    <a
                        href={
                            lineSelected
                                ? `/userForm/alter/${props.clients[lineSelected.rowIndex - 1].id
                                }`
                                : ""
                        }
                    >
                        <button id="updatebtn" className={styles.updateButton} disabled={!lineSelected}>
                            Alterar
                        </button>
                    </a>
                    <Link href="/userForm">
                        <a>
                            <button className={styles.createButton}>Cadastrar</button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
