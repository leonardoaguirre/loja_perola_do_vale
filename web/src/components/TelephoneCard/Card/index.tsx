import api from '../../../services/api';
import { FaPen, FaTrash } from 'react-icons/fa';
import styles from './styles.module.css';
import { FormEvent, MouseEvent, useContext, useState } from 'react';
import { ModalExclusion, ModalSmall } from '../../Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';
import { useRouter } from 'next/router';
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
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [telefone, setTelefone] = useState<Telephone>(props.telephone)
  const [erroCadastro, setErroCadastro] = useState([])
  const { user } = useContext(UserContext)
  const router = useRouter()

  const deleteTelephone = (e: MouseEvent) => {
    e.preventDefault()

    api.delete('Telefone/Deletar', { data: { id: props.telephone.id } })
      .then((res: any) => {
        alert('Telefone excluido com sucesso!');
        router.reload()
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
      alert(`Telefone (${telefone.ddd})${telefone.numero} alterado com sucesso!`)
      router.reload()
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
          <button onClick={(e) => {setShowDeleteModal(true); e.preventDefault() }}>
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
            <Form onSubmit={(e) => onSubmitForm(e)}>
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

              <Row className="justify-content-md-center" lg={2}>
                <Button variant="primary" type="submit">
                  Alterar
                </Button>
              </Row>
            </Form>
          </ModalSmall>
          : ``
        }
        {showDeleteModal ?
          <ModalExclusion
            objectName='Telefone'
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