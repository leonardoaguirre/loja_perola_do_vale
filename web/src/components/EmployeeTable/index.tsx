import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useToasts } from '../../contexts/ToastContext';
import { Employee } from '../../models/Employee';
import api from '../../services/api';
import { ModalExclusion } from '../Modal';
import styles from './styles.module.css';


interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = (props) => {

  const router = useRouter();
  const { addToast } = useToasts();
  const [lineSelected, setLineSelected] = useState(null);
  const [showExclusionModal, setShowExclusionModal] = useState<boolean>(false)

  const selecionaLinha = async (event) => {

    const linha: HTMLElement = findTr(event.target);

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
  };

  const findTr = (el) => {
    const parentNode: HTMLElement = el.parentNode;
    if (parentNode.tagName == "TR") {
      // TR encontrado
      return parentNode;
    } else {
      // Ainda não é o TR
      console.log(parentNode)
      const trEl = findTr(parentNode);
      return trEl;
    }
  }

  const removeLinha = async (trIndex: number) => {
    var el: any = document.getElementById("table");
    el.deleteRow(trIndex);
    setLineSelected(null);
  };

  const deleteUser = (userId: string, trIndex: number) => {
    api.delete("Funcionario/Deletar", {
      data: {
        id: userId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
          addToast({
            title: 'Funcionário deletado',
            content: `O funcionário foi deletado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar deletar o funcionário`,
            delay: 8000,
            autohide: true,
          })
        }
      }
    ).catch(
      (error) => {
        addToast({
          title: 'Falha',
          content: `${error ? error : `Erro ao tentar deletar`}`,
          delay: 8000,
          autohide: true,
        })
      }
    )
    setShowExclusionModal(false);
  }

  const onClickButton = (url: string) => {
    router.push(url);
  }

  return (
    <div className={styles.clientTable}>
      <Table responsive striped bordered hover id="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>RG</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody onMouseDown={selecionaLinha}>
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
      </Table>
      <div className={styles.bContainer}>
        <div className={styles.aContainer}>
          <div className={styles.actions}>
            <div className={styles.hover}>
              <div className={styles.edit}>
                <button
                  title="Editar"
                  className={lineSelected ? styles.active : styles.disabled}
                  disabled={!lineSelected}
                  onClick={() =>
                    onClickButton(`/adm/manage/user/employee/form/${props.employees[lineSelected.rowIndex - 1].id}`)
                  }
                >
                  <FaPen />
                </button>
              </div>
              <div className={styles.delete}>
                <button
                  title="Excluir"
                  id="deletebtn"
                  className={lineSelected ? styles.active : styles.disabled}
                  onClick={() =>
                    setShowExclusionModal(true)
                  }
                  disabled={!lineSelected}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showExclusionModal ?
        <ModalExclusion
          objN="Funcionário"
          show={showExclusionModal}
          onConfirm={(e) => deleteUser(props.employees[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
          onHide={() => setShowExclusionModal(false)}
        >
          Você realmente deseja excluir o funcionário <span className="bold">{props.employees[lineSelected.rowIndex - 1].pessoaFisica.nome}</span>?
        </ModalExclusion>
        : ''
      }
    </div>
  );
};

export default EmployeeTable;
