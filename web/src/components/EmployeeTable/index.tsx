import Link from "next/link";
import React, { useState } from "react";

import styles from "./styles.module.css";
import api from '../../services/api';
import { Employee } from '../../models/Employee';


interface EmployeeProps {
  employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeProps> = (props) => {
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
    api.delete("Funcionario/Deletar", {
      data: {
        id: userid
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
        } else {
          console.log("Falha ao deletar funcionario");
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }

  return (
    <div className={styles.employeeTable}>
      {console.log(props.employees)}
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
          {props.employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.pessoaFisica.nome}</td>
              <td>{employee.pessoaFisica.rg}</td>
              <td>{employee.pessoaFisica.cpf}</td>
              <td>{employee.pessoaFisica.dtNasc}</td>
              <td>{employee.pessoaFisica.pessoa.email}</td>
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
              deleteUser(props.employees[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)
            }
            disabled={!lineSelected}
          >
            Excluir
          </button>
          <a
            href={
              lineSelected
                ? `/adm/manage/user/employee/form/${props.employees[lineSelected.rowIndex - 1].id
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

export default EmployeeTable;
