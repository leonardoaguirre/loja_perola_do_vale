import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineAdd } from 'react-icons/md';

import { useToasts } from '../../../contexts/ToastContext';
import { UserContext } from '../../../contexts/UserContext';
import { Endereco } from '../../../models/Endereco';
import api from '../../../services/api';
import { ModalLarge } from '../../Modal';
import styles from './styles.module.css';


function PostalAdressCardNew() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [endereco, setEndereco] = useState<Endereco>({})
  const [erroCep, setErroCep] = useState<string>('')
  const [erroCadastro, setErroCadastro] = useState([])
  const { user } = useContext(UserContext);
  const { add } = useToasts();
  const router = useRouter()

  const onChangeCep = (e) => {
    const cep: string = e.target.value
    if (cep.length === 8) {
      api.get(`Correios/ConsultaCep/${cep}`)
        .then((res) => {
          setEndereco(
            {
              ...endereco,
              cep: res.data.cep,
              logradouro: res.data.logradouro,
              bairro: res.data.bairro,
              localidade: res.data.localidade,
              uf: res.data.uf,
            }
          )
          setErroCep('')
        })
        .catch(() => {
          esvaziaEndereco()
          setErroCep(`CEP Inválido`)
        })
    } else if (cep.length > 0) {
      setErroCep(`CEP Inválido`)
      esvaziaEndereco()
    }
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (endereco.cep && endereco.numero) {
      api.post('Endereco/Adicionar/',
        {
          titulo: endereco.titulo || '',
          cep: endereco.cep,
          rua: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          estado: endereco.uf,
          idPessoa: user.idPessoa
        }
      )
        .then(() => {
          setShowModal(false)
          add({
            title: 'Endereço Excluido',
            content: `Endereço ${endereco.titulo ? endereco.titulo : ``} cadastrado com sucesso!`,
            delay: 8000,
            autohide: true,
          });
          router.reload()
        })
        .catch((err) => {
          setErroCadastro(err.response.data)
        })
    }
  }

  const onChangeEndereco = (field, value) => setEndereco({ ...endereco, [field]: value })

  const esvaziaEndereco = () => setEndereco({ ...endereco, logradouro: ``, bairro: ``, localidade: ``, uf: `` })

  return (
    <>
      <div className={styles.postalAdressCardNew}>
        <a onClick={() => setShowModal(true)}>
          <div title="Adicionar endereço">
            <AiOutlineHome className={styles.homeIcon} />
            <MdOutlineAdd className={styles.addIcon} />
          </div>
          <div>Adicionar novo endereço</div>
        </a>
      </div>

      {showModal ?
        <ModalLarge title='Cadastrar novo endereço' onHide={() => { setShowModal(false); esvaziaEndereco(); setErroCadastro([]) }} show={showModal}>
          <Form onSubmit={(e) => onFormSubmit(e)}>
            <Form.Group className="mb-3" controlId="Titulo">
              <Form.Label>Titulo</Form.Label>
              <Form.Control placeholder="(Opcional)" onChange={(e) => { onChangeEndereco('titulo', e.target.value) }} />
            </Form.Group>

            <Row>
              <Col xs={3}>
                <Form.Group className="mb-3" controlId="cep">
                  <Form.Label>Cep</Form.Label>
                  <Form.Control type='number' placeholder="Somente Numeros" htmlSize={8} onChange={(e) => onChangeCep(e)} isInvalid={erroCep != ''} required />
                  {erroCep ? <Form.Control.Feedback type='invalid'>{erroCep}</Form.Control.Feedback> : ''}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="rua" as={Col}>
                  <Form.Label>Rua</Form.Label>
                  <Form.Control readOnly={true} defaultValue={endereco.logradouro} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={2}>
                <Form.Group controlId="numero">
                  <Form.Label>Numero</Form.Label>
                  <Form.Control htmlSize={3} type='number' onChange={(e) => onChangeEndereco('numero', e.target.value)} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="complemento">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control onChange={(e) => onChangeEndereco('complemento', e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Form.Group className="mb-3" controlId="bairro" as={Col}>
                <Form.Label>Bairro</Form.Label>
                <Form.Control readOnly={true} defaultValue={endereco.bairro} />
              </Form.Group>
              <Form.Group as={Col} controlId="cidade">
                <Form.Label>Cidade</Form.Label>
                <Form.Control readOnly={true} defaultValue={endereco.localidade} />
              </Form.Group>
              <Form.Group as={Col} controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control readOnly={true} defaultValue={endereco.uf} />
              </Form.Group>
            </Row>

            {erroCadastro ? erroCadastro.map((err) => {
              return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
            }) : ``}

            <Row className="justify-content-md-center">
              <Button className="w-100" variant="primary" type="submit">
                Cadastrar
              </Button>
            </Row>
          </Form>
        </ModalLarge >
        : <></>
      }
    </>
  )
}

export default PostalAdressCardNew;