import { useState } from 'react';
import Link from 'next/link';
import { Product } from '../../models/Product';
import styles from './styles.module.css';
import api from '../../services/api';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = (props) => {

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

  const deleteProduct = (productId: string, trIndex: number) => {
    console.log(productId, trIndex);

    api.delete("Produto/Deletar", {
      data: {
        id: productId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          removeLinha(trIndex);
        } else {
          console.log("Falha ao deletar produto");
        }
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
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
              <td><img src={`http://localhost:3008/${product.imagens[0].path}`} alt={product.nome} /></td>
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
              deleteProduct(props.products[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)
            }
            disabled={!lineSelected}
          >
            Excluir
          </button>
          <a
            href={
              lineSelected
                ? `/adm/manage/products/form/${props.products[lineSelected.rowIndex - 1].id
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
}

export default ProductTable;