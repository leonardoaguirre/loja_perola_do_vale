import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaBoxes, FaPen, FaTrash } from 'react-icons/fa';

import { useToasts } from '../../contexts/ToastContext';
import { environment } from '../../environments/environment';
import { Product } from '../../models/Product';
import api from '../../services/api';
import { Utils } from '../../shared/classes/utils';
import { ModalExclusion } from '../Modal';
import StockResume from '../StockResume';
import styles from './styles.module.css';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = (props) => {

  const router = useRouter();
  const { addToast } = useToasts()

  const [lineSelected, setLineSelected] = useState(null);
  const [showExclusionModal, setShowExclusionModal] = useState<boolean>(false)
  const [showStockModal, setShowStockModal] = useState<boolean>(false)

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
      const trEl = findTr(parentNode);
      return trEl;
    }
  }

  const removeLinha = async (trIndex: number) => {
    var el: any = document.getElementById("table");
    el.deleteRow(trIndex);
    setLineSelected(null);
  };

  const deleteProduct = (productId: string, trIndex: number) => {
    api.delete("Produto/Deletar", {
      data: {
        id: productId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
          addToast({
            title: 'Produto deletado',
            content: `O produto foi deletado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar deletar o produto`,
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

  const onClickButton = (url: string, event: any) => {
    router.push(url);
  }

  return (
    <div className={styles.productTable}>
      <Table responsive striped bordered hover id={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor de Venda</th>
            <th>Imagem</th>
          </tr>
        </thead>
        <tbody onMouseDown={selecionaLinha}>
          {props.products.map((product, index) => (
            <tr key={index}>
              <td className={styles.textLimited}><p>{product.nome}</p></td>
              <td>{product.marca}</td>
              <td className={styles.textLimited}><p>{product.descricao}</p></td>
              <td className={styles.alignLeft}>{product.quantidade}</td>
              <td className={styles.alignLeft}>R$ {Utils.formatMoney(product.valorVenda) }</td>
              <td>
                <div className={styles.imgContainer}>
                  <div>
                    <img src={`${environment.API}/${product.imagens[0].path}`} alt={product.nome} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className={styles.bContainer}>
        <div className={styles.aContainer}>
          <div className={styles.actions}>
            <div className={styles.hover}>
              <div className={styles.consult}>
                <button
                  title="Consultar Estoque"
                  className={lineSelected ? styles.active : styles.disabled}
                  disabled={!lineSelected}
                  onClick={(event) => setShowStockModal(true)}
                >
                  <FaBoxes />
                </button>
              </div>
              <div className={styles.edit}>
                <button
                  title="Editar"
                  className={lineSelected ? styles.active : styles.disabled}
                  disabled={!lineSelected}
                  onClick={(event) =>
                    onClickButton(`/adm/manage/products/form/${props.products[lineSelected.rowIndex - 1].id}`, event)
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
          objN="Produto"
          show={showExclusionModal}
          onConfirm={(e) => deleteProduct(props.products[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
          onHide={() => setShowExclusionModal(false)}
        >
          Você realmente deseja excluir o produto <span className="bold">{props.products[lineSelected.rowIndex - 1].nome}</span>?
        </ModalExclusion>
        : ''
      }
      {showStockModal ?
        <StockResume show={showStockModal} product={props.products[lineSelected.rowIndex - 1]} onClose={(show) => setShowStockModal(show)}></StockResume>
        :
        ``
      }
    </div>
  );
}

export default ProductTable;