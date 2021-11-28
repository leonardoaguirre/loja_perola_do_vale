import { MouseEvent, useState } from 'react';
import { Product } from '../../models/Product';
import styles from './styles.module.css';
import api from '../../services/api';
import { useRouter } from 'next/router';
import { environment } from '../../environments/environment';
import StockResume from '../StockResume';
import { ModalExclusion } from '../Modal';
import { useToasts } from '../../contexts/ToastContext';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = (props) => {

  const router = useRouter();
  const { add } = useToasts()

  const [lineSelected, setLineSelected] = useState(null);
  const [showExclusionModal, setShowExclusionModal] = useState<boolean>(false)
  const [showStockModal, setShowStockModal] = useState<boolean>(false)

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

  const deleteProduct = (productId: string, trIndex: number) => {
    api.delete("Produto/Deletar", {
      data: {
        id: productId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
          add({
            title: 'Produto deletado',
            content: `O produto foi deletado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
        } else {
          add({
            title: 'Falha',
            content: `Falha ao tentar deletar o produto`,
            delay: 8000,
            autohide: true,
          })
        }
      }
    ).catch(
      (error) => {
        add({
          title: 'Falha',
          content: `${error? error : `Erro ao tentar deletar`}`,
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
      <table id="table" className={styles.table}>
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
        <tbody onClick={selecionaLinha}>
          {props.products.map((product, index) => (
            <tr key={index}>
              <td>{product.nome}</td>
              <td>{product.marca}</td>
              <td>{product.descricao}</td>
              <td>{product.quantidade}</td>
              <td>{product.valorVenda}</td>
              <td><img src={`${environment.API}/${product.imagens[0].path}`} alt={product.nome} /></td>
            </tr>
          ))}
        </tbody>
      </table>
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
                  <img src="/icons/edit_white_36dp.svg" alt="editar" />
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
                  <img src="/icons/edit_white_36dp.svg" alt="editar" />
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
                  <img src="/icons/delete_white_36dp.svg" alt="deletar" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showExclusionModal ?
        <ModalExclusion
          objN='Produto'
          show={showExclusionModal}
          onConfirm={(e) => deleteProduct(props.products[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
          onHide={() => setShowExclusionModal(false)}>
        </ModalExclusion>
        : ''
      }
      {showStockModal?
      <StockResume show={showStockModal} product={props.products[lineSelected.rowIndex - 1]} onClose={(show) => setShowStockModal(show)}></StockResume>
      :
      ``
      }
    </div>
  );
}

export default ProductTable;