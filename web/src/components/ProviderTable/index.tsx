import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useToasts } from '../../contexts/ToastContext';
import { Provider } from '../../models/Provider';
import api from '../../services/api';
import { ModalExclusion } from '../Modal';
import styles from './styles.module.css';


interface ProviderTableProps {
  providers: Provider[];
}

const ProviderTable: React.FC<ProviderTableProps> = (props) => {

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

  const deleteUser = (providerId: string, trIndex: number) => {
    api.delete("Fornecedor/Deletar", {
      data: {
        id: providerId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
          addToast({
            title: 'Fornecedor deletado',
            content: `O fornecedor foi deletado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar deletar o fornecedor`,
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
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Email</th>
            {/* <th>Telefone</th> */}
            {/* <th>Endereço</th> */}
          </tr>
        </thead>
        <tbody onMouseDown={selecionaLinha}>
          {props.providers.map((provider, index) => (
            <tr key={index}>
              <td>{provider.pessoaJuridica.nomeFantasia}</td>
              <td>{provider.pessoaJuridica.cnpj}</td>
              <td>{provider.pessoaJuridica.pessoa.email}</td>
              {/* <td>{provider.pessoaJuridica.pessoa?.telefones[0]}</td> // TODO: listar telefones */}
              {/* <td>{provider.pessoaJuridica.pessoa?.enderecos[0]}</td> // TODO: listar enderecos */}
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
                    onClickButton(`/adm/manage/provider/form/${props.providers[lineSelected.rowIndex - 1].id}`)
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
          onConfirm={(e) => deleteUser(props.providers[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
          onHide={() => setShowExclusionModal(false)}
        >
          Você realmente deseja excluir o fornecedor <span className="bold">{props.providers[lineSelected.rowIndex - 1].pessoaJuridica.nomeFantasia}</span>?
        </ModalExclusion>
        : ''
      }
    </div>
  );
};

export default ProviderTable;