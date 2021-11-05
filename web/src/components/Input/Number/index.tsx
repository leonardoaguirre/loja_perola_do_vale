import styles from './styles.module.css';

import { ImMinus, ImPlus } from 'react-icons/im';
import { FaTrashAlt } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CartContext } from '../../../contexts/CartContext';

interface InputNumberProps {
  initialQuantity: number;
  idProduto: string;
}

const InputNumber : React.FC<InputNumberProps> = ({
  initialQuantity,
  idProduto
}) => {
  const { changeQt, removeFromCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(initialQuantity ? initialQuantity : 1);
  const [maxLimit, setMaxLimit] = useState<number>(5);

  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    console.log(idProduto, quantity)
    if (quantity == 0) {
      // excluir item
      console.log("excluir");
      removeFromCart(idProduto);
    } else if (quantity >= maxLimit) {
      console.log("alterar para max");
      setQuantity(maxLimit);
      changeQt(idProduto, quantity);
    } else if (isNaN(quantity)) {
      console.log("alterar para min");
      setQuantity(1);
      changeQt(idProduto, quantity);
    } else {
      console.log("alterar")
      changeQt(idProduto, quantity)
    }
  }, [quantity])

  return (
    <div className={styles.container}>
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
        onHide={() => {setModalShow(false)}}
        confirm={() => {setQuantity(0);setModalShow(false)}}
      />
    </div>
  );
}

const MyModal = (props) => {

  const { onHide, confirm, ...others } = props;

  return (
    <Modal
      {...others}
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
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={confirm}>Concluído</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InputNumber;