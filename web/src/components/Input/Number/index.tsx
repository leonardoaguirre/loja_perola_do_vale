import { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { ImMinus, ImPlus } from 'react-icons/im';

import { CartContext } from '../../../contexts/CartContext';
import styles from './styles.module.css';

interface InputNumberProps {
  initialQuantity: number;
  idProduto: string;
  store?: boolean;
  changedQuantity: () => void;
}

const InputNumber: React.FC<InputNumberProps> = ({
  initialQuantity,
  idProduto,
  store,
  changedQuantity
}) => {
  const { cartProducts, changeQt, removeFromCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(initialQuantity ? initialQuantity : 1);
  const [maxLimit, setMaxLimit] = useState<number>(5);

  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (store) setQuantity(initialQuantity ? initialQuantity : 1);
  }, [cartProducts])

  useEffect(() => {
    console.log(idProduto, quantity)
    if (store) {
      if (quantity == 0) {
        // excluir item
        removeFromCart(idProduto);
      } else if (quantity >= maxLimit) {
        // alterar para o max
        setQuantity(maxLimit);
        changeQt(idProduto, quantity);
        changedQuantity();
      } else if (isNaN(quantity)) {
        // alterar para o min
        setQuantity(1);
        changeQt(idProduto, quantity);
        changedQuantity();
      } else {
        // alterar quantidade
        changeQt(idProduto, quantity)
        changedQuantity();
      }
    } else {
      if (quantity == 0) {
        // excluir item
        setQuantity(1);
      } else if (quantity >= maxLimit) {
        // alterar para o max
        setQuantity(maxLimit);
        changedQuantity();
      } else if (isNaN(quantity)) {
        // alterar para o min
        setQuantity(1);
        changedQuantity();
      } else {
        // alterar quantidade
        changedQuantity();
      }
    }
  }, [quantity])

  return (
    <div className={styles.container}>
      <div className={styles.inputNumber}>
        {((quantity == 1) ? (
          (store ? (
            <button id={styles.minus} onClick={() => setModalShow(true)}><FaTrashAlt /></button>
          ) : (
            <button id={styles.minus} disabled><ImMinus /></button>
          ))
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
        onHide={() => { setModalShow(false) }}
        confirm={() => { setQuantity(0); setModalShow(false) }}
      />
    </div>
  );
}

const MyModal = (props) => {

  const { onHide, confirm, ...others } = props;

  return (
    <Modal
      {...others}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
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