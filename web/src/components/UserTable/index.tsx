import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useToasts } from '../../contexts/ToastContext';
import { Customer } from '../../models/Customer';
import api from '../../services/api';
import { ModalExclusion } from '../Modal';
import styles from './styles.module.css';


interface ClientTableProps {
  customers: Customer[];
}

const UserTable: React.FC<ClientTableProps> = (props) => {

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
    // console.log(userid)
    // api.delete("Cliente/Deletar", {
    //   data: {
    //     id: userid
    //   }
    // }).then(
    //   (res) => {
    //     if (res.status === 200) {
    //       removeLinha(trIndex);
    //     } else {
    //       console.log("Falha ao deletar cliente");
    //     }
    //   }
    // ).catch(
    //   (error) => {
    //     console.log(error);
    //   }
    // )
    api.delete("Cliente/Deletar", {
      data: {
        id: userId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
          addToast({
            title: 'Cliente deletado',
            content: `O cliente foi deletado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar deletar o cliente`,
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
      <Table responsive striped bordered hover id={styles.table}>
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
                    onClickButton(`/adm/manage/user/customer/form/${props.customers[lineSelected.rowIndex - 1].id}`)
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
          objN="Cliente"
          show={showExclusionModal}
          onConfirm={(e) => deleteUser(props.customers[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
          onHide={() => setShowExclusionModal(false)}
        >
          Você realmente deseja excluir o cliente <span className="bold">{props.customers[lineSelected.rowIndex - 1].pessoaFisica.nome}</span>?
        </ModalExclusion>
        : ''
      }
    </div>
  );
};

export default UserTable;
