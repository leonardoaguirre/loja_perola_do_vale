import Link from "next/link";
import React, { useState } from "react";

import styles from "./styles.module.css";
import api from '../../services/api';
import { Provider } from '../../models/Provider';


interface ProviderTableProps {
  providers: Provider[];
}

const ProviderTable: React.FC<ProviderTableProps> = (props) => {
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
    api.delete("Fornecedor/Deletar", {
      data: {
        id: userid
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
        } else {
          console.log("Falha ao deletar fornecedor");
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  return (
    <div className={styles.providerTable}>
      <table id="table" className={styles.table}>
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
          </tr>
        </thead>
        <tbody onClick={selecionaLinha}>
          {props.providers.map((provider, index) => (
            <tr key={index}>
              <td>{provider.pessoaJuridica.nomeFantasia}</td>
              <td>{provider.pessoaJuridica.cnpj}</td>
              <td>{provider.pessoaJuridica.pessoa.email}</td>
              {/* <td>{provider.pessoaJuridica.pessoa.telefones[0]}</td> // TODO: listar telefones */}
              {/* <td>{provider.pessoaJuridica.pessoa.enderecos[0]}</td> // TODO: listar enderecos */}
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
              deleteUser(props.providers[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)
            }
            disabled={!lineSelected}
          >
            Excluir
          </button>
          <a
            href={
              lineSelected
                ? `/adm/manage/provider/Form/${props.providers[lineSelected.rowIndex - 1].id
                }`
                : ""
            }
          >
            <button id="updatebtn" className={styles.updateButton} disabled={!lineSelected}>
              Alterar
            </button>
          </a>
          <Link href="/">
            <a>
              <button className={styles.createButton}>Cadastrar</button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderTable;
