import Link from "next/link";
import React, { useState } from "react";

import styles from "./styles.module.css";
import api from '../../services/api';
import { Customer } from '../../models/Customer';


interface ClientTableProps {
  customers: Customer[];
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

  const deleteUser = (userid: string, trIndex: number) => {
    console.log(userid)
    api.delete("Cliente/Deletar", {
      data: {
        id: userid
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
        } else {
          console.log("Falha ao deletar cliente");
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  return (
    <div className={styles.clientTable}>
      <table id="table" className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Rg</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody onClick={selecionaLinha}>
          {props.customers.map((client, index) => (
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
              deleteUser(props.customers[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)
            }
            disabled={!lineSelected}
          >
            Excluir
          </button>
          <a
            href={
              lineSelected
                ? `/adm/manage/user/customer/form/${props.customers[lineSelected.rowIndex - 1].id
                }`
                : ""
            }
          >
            <button id="updatebtn" className={styles.updateButton} disabled={!lineSelected}>
              Alterar
            </button>
          </a>
          <Link href="/user/form">
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
