import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useToasts } from '../../../contexts/ToastContext';
import { UserContext } from '../../../contexts/UserContext';
import api from '../../../services/api';
import { ModalExclusion, ModalSmall } from '../../Modal';
import styles from './styles.module.css';

interface Telephone {
  id: string;
  ddd: string;
  numero: string;
}

interface TelephoneCardProps {
  telephone: Telephone;
  index: number;
}

const TelephoneCard: React.FC<TelephoneCardProps> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [telefone, setTelefone] = useState<Telephone>(props.telephone);
  const [erroCadastro, setErroCadastro] = useState([]);
  const [disabledAlt, setDisabledAlt] = useState<boolean>(true);
  const { user } = useContext(UserContext)
  const { add } = useToasts();
  const router = useRouter()

  useEffect(() => {
    if (props.telephone == telefone) {
      setDisabledAlt(true);
    } else {
      setDisabledAlt(false);
    }
  }, [telefone])

  const deleteTelephone = (e: MouseEvent) => {
    e.preventDefault()

    api.delete('Telefone/Deletar', { data: { id: props.telephone.id } })
      .then((res: any) => {
        router.reload()
        add({
          title: 'Telefone Excluido',
          content: `Telefone (${telefone.ddd})${telefone.numero} excluido com sucesso!`,
          delay: 8000,
          autohide: true,
        });
      })
      .catch((err: string) => {
        console.log(err);
      })
  }

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    api.patch(`Telefone/Alterar/`, {
      numero: telefone.numero,
      ddd: telefone.ddd,
      id: telefone.id,
      idPessoa: user.idPessoa
    }).then(() => {
      setShowModal(false)
      router.reload();
      add({
        title: 'Telefone Alterado',
        content: `Telefone (${telefone.ddd})${telefone.numero} alterado com sucesso!`,
        delay: 8000,
        autohide: true,
      });
    }).catch((err) => {
      setErroCadastro(err.response.data)
    })
  }

  const onChangeTelefone = (field, value) => setTelefone({ ...telefone, [field]: value })

  return (
    <div className={styles.telephoneCard}>
      <header>
        <div className={styles.telephoneTitle}>
          <strong>Opção {props.index + 1}</strong>
        </div>
        <div className={styles.telephoneActions}>
          <button onClick={(e) => { setShowModal(true); e.preventDefault() }}>
            <FaPen />
          </button>
          <button onClick={(e) => { setShowDeleteModal(true); e.preventDefault() }}>
            <FaTrash />
          </button>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.dddNumber}>
          <label htmlFor="ddd">DDD</label>
          <input type="text" name="ddd" value={`(${props.telephone.ddd})`} disabled />
        </div>
        <div className={styles.telephoneNumber}>
          <label htmlFor="number">Número</label>
          <input type="text" name="number" value={`${props.telephone.numero.slice(0, 1)} ${props.telephone.numero.slice(1, 5)}-${props.telephone.numero.slice(5, 9)}`} disabled />
        </div>
      </div>
      <>
        {showModal ?
          <ModalSmall title="Alterar telefone" onHide={() => { setShowModal(false); setErroCadastro([]); setTelefone(props.telephone) }} show={showModal}>
            <Form id={styles.alterForm} onSubmit={(e) => onSubmitForm(e)}>
              <Row >
                <Col xs={4}>
                  <Form.Group className='mb-3' controlId='ddd'>
                    <Form.Label>DDD</Form.Label>
                    <Form.Control type='number' value={telefone.ddd} onChange={(e) => onChangeTelefone('ddd', e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col xs={8}>
                  <Form.Group className='mb-3' controlId='numero'>
                    <Form.Label>Numero</Form.Label>
                    <Form.Control type='number' value={telefone.numero} onChange={(e) => onChangeTelefone('numero', e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              {erroCadastro ? erroCadastro.map((err) => {
                return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
              }) : ``}

              <Row className="justify-content-md-center">
                <Button className="w-100" variant="primary" type="submit" disabled={disabledAlt}>
                  Alterar
                </Button>
              </Row>
            </Form>
          </ModalSmall>
          : ``
        }
        {showDeleteModal ?
          <ModalExclusion
            objN='Telefone'
            show={showDeleteModal}
            onConfirm={(e) => deleteTelephone(e)}
            onHide={() => setShowDeleteModal(false)}
          />
          : ''
        }
      </>
    </div>
  )
}

export default TelephoneCard;