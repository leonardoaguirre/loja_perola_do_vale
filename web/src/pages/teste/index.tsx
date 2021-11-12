import styles from '../../components/Input/Number/styles.module.css';

import { ImMinus, ImPlus } from 'react-icons/im';
import { FaTrashAlt } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CartContext } from '../../contexts/CartContext';

interface TesteProps {
  initialQuantity: number;
  idProduto: string;
}

const Teste: React.FC<TesteProps> = ({
  initialQuantity,
  idProduto
}) => {
  const { changeQt, removeFromCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(initialQuantity ? initialQuantity : 1);
  const [maxLimit, setMaxLimit] = useState<number>(5);

  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    console.log(quantity)
    if (quantity == 0) {
      console.log("exluir item");
      // excluir item
      
    } else if (quantity >= maxLimit) {
      console.log("limite");
      setQuantity(maxLimit);
    } else if (isNaN(quantity)) {
      console.log("NaN");
      setQuantity(0);
    }
  }, [quantity])

  return (
    <div className="pageContainer">
      <div className={styles.inputNumber}>
        {((quantity == 1) ? (
          <button id={styles.minus} onClick={() => setModalShow(true)}><FaTrashAlt /></button>
        ) : (
          <button id={styles.minus} onClick={() => setQuantity(quantity - 1)}><ImMinus /></button>
        ))}
        <input type="number" value={quantity} onChange={(event) => setQuantity(parseInt(event.target.value))} />
        {((quantity == maxLimit) ? (
          <button id={styles.plus} disabled><ImPlus /></button>
        ) : (
          <button id={styles.plus} onClick={() => setQuantity(quantity + 1)}><ImPlus /></button>
        ))}
      </div>

      <MyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={() => setQuantity(0)}
      >

      </MyModal>
    </div>
  );
}

const MyModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h4>Excluir</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Deseja realmente excluir este item do carrinho?</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cancelar</Button>
        <Button onClick={() => {props.onConfirm; props.onHide}}>Concluído</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Teste;