import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { BsTelephonePlus } from 'react-icons/bs';

import { useToasts } from '../../../contexts/ToastContext';
import { UserContext } from '../../../contexts/UserContext';
import { Telephone } from '../../../models/Costumer';
import api from '../../../services/api';
import { ModalSmall } from '../../Modal';
import styles from './styles.module.css';

function TelephoneCardNew() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [telefone, setTelefone] = useState<Telephone>()
  const [erroCadastro, setErroCadastro] = useState([])
  const { user } = useContext(UserContext);
  const { add } = useToasts();
  const router = useRouter()

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    api.post('Telefone/Adicionar/', {
      numero: telefone.numero,
      ddd: telefone.ddd,
      idPessoa: user.idPessoa
    }).then(() => {
      setShowModal(false)
      router.reload()
      add({
        title: 'Telefone Cadastrado',
        content: `Telefone (${telefone.ddd})${telefone.numero} cadastrado com sucesso!`,
        delay: 8000,
        autohide: true,
      });
    }).catch((err) => {
      setErroCadastro(err.response.data)
    })
  }

  const onChangeTelefone = (field, value) => setTelefone({ ...telefone, [field]: value })

  const esvaziaTelefone = () => setTelefone({ ddd: '', id: '', numero: '' })

  return (
    <>

      <div className={styles.telephoneCardNew}>
        <a onClick={() => setShowModal(true)}>
          <div title="Adicionar telefone" className={styles.icon}>
            <BsTelephonePlus />
          </div>
          <div>Adicionar novo telefone</div>
        </a>
      </div>

      {showModal ?
        <ModalSmall title="Cadastrar um novo telefone" onHide={() => { setShowModal(false); esvaziaTelefone(); setErroCadastro([]) }} show={showModal}>
          <Form id={styles.form} onSubmit={(e) => onSubmitForm(e)}>
            <Row >
              <Col xs={4}>
                <Form.Group className='mb-3' controlId='ddd'>
                  <Form.Label>DDD</Form.Label>
                  <Form.Control type='number' onChange={(e) => onChangeTelefone('ddd', e.target.value)} required />
                </Form.Group>
              </Col>
              <Col xs={8}>
                <Form.Group className='mb-3' controlId='numero'>
                  <Form.Label>Numero</Form.Label>
                  <Form.Control type='number' onChange={(e) => onChangeTelefone('numero', e.target.value)} required />
                </Form.Group>
              </Col>

            </Row>

            {erroCadastro ? erroCadastro.map((err) => {
              return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
            }) : ``}

            <Row className="justify-content-md-center">
              <Col xs={12}>
                <Button className="w-100" variant="primary" type="submit">
                  Cadastrar
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalSmall>
        : ``
      }
    </>

  )
}

export default TelephoneCardNew;