import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Adress } from '../../../models/Costumer';
import { Endereco } from '../../../models/Endereco';
import api from '../../../services/api';
import { ModalExclusion, ModalLarge, ModalSmall } from '../../Modal';
import styles from './styles.module.css';

interface PostalAdressCardProps {
  postalAdress: Adress;
  selectable?: boolean;
  selected?: boolean;
}

const PostalAdressCard: React.FC<PostalAdressCardProps> = ({
  postalAdress,
  selectable,
  selected,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [endereco, setEndereco] = useState<Endereco>({
    titulo: postalAdress.titulo,
    cep: postalAdress.cep.replace(`-`, ``),
    logradouro: postalAdress.rua,
    numero: parseInt(postalAdress.numero),
    complemento: postalAdress.complemento,
    bairro: postalAdress.bairro,
    localidade: postalAdress.cidade,
    uf: postalAdress.estado,
  })
  const [erroCadastro, setErroCadastro] = useState([])
  const [erroCep, setErroCep] = useState<string>('')
  const { user } = useContext(UserContext)
  const router = useRouter()

  const onChangeEndereco = (field, value) => setEndereco({ ...endereco, [field]: value })

  const esvaziaEndereco = () => setEndereco({ logradouro: ``, bairro: '', localidade: ``, uf: `` })

  const deleteAdress = (e: MouseEvent) => {
    e.preventDefault()

    api.delete('Endereco/Deletar', { data: { id: postalAdress.id } })
      .then((res: any) => {
        alert('Endereço excluido com sucesso!');
        router.reload()
      })
      .catch((err: string) => {
        console.log(err);
      })
  }

  const onChangeCep = (e) => {
    const cep: string = e.target.value
    if (cep.length === 8) {
      api.get(`Correios/ConsultaCep/${cep.replace(`-`, ``)}`)
        .then((res) => {
          setEndereco({
            cep: res.data.cep,
            logradouro: res.data.logradouro,
            bairro: res.data.bairro,
            localidade: res.data.localidade,
            uf: res.data.uf,
          })
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

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(endereco.numero, postalAdress.numero);

    api.patch(`Endereco/Alterar/`, {
      idEndereco: postalAdress.id,
      idPessoa: user.idPessoa,
      cep: endereco.cep,
      complemento: endereco.complemento || postalAdress.complemento,
      titulo: endereco.titulo || postalAdress.titulo,
      rua: endereco.logradouro,
      numero: endereco.numero ? String(endereco.numero) : String(postalAdress.numero),
      bairro: endereco.bairro,
      cidade: endereco.localidade,
      estado: endereco.uf
    }).then((res) => {
      setShowModal(false)
      alert(`Endereço (${endereco.titulo || postalAdress.titulo}) alterado com sucesso!`)
      router.reload()
    }).catch((err) => {
      setErroCadastro(err.response.data)
    })
  }

  return (
    <div className={selectable ? selected ? `${styles.postalAdress} ${styles.selectable} ${styles.selected}` : `${styles.postalAdress} ${styles.selectable}` : styles.postalAdress}>
      <header>
        <div className={styles.postalAdressTitle}>
          <strong>{postalAdress.titulo}</strong>
        </div>
        <div className={styles.postalAdressActions}>
          <button title="editar" onClick={(e) => { setShowModal(true); e.preventDefault() }}>
            <FaPen />
          </button>
          <button title="excluir" onClick={(e) => { setShowDeleteModal(true); e.preventDefault() }}>
            <FaTrash />
          </button>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.adress}>
          <div>{`${postalAdress.rua}, ${postalAdress.numero}`}</div>
        </div>
        <div className={styles.complementAndDistrict}>
          <div>{`${postalAdress.complemento} | ${postalAdress.bairro}`}</div>
        </div>
        <div className={styles.location}>
          <div>{`${postalAdress.cidade}, ${postalAdress.estado} - ${postalAdress.cep}`}</div>
        </div>
      </div>
      <>
        {showModal ?
          <ModalLarge title='Alterar endereço' onHide={() => {
            //seta os valores padroes ao endereco caso sejam alterados no form e o mesmo seja fechado
            setShowModal(false); setErroCadastro([]); setErroCep(``); setEndereco({
              titulo: postalAdress.titulo,
              cep: postalAdress.cep.replace('-', ''),
              logradouro: postalAdress.rua,
              numero: Number(postalAdress.numero),
              complemento: postalAdress.complemento,
              bairro: postalAdress.bairro,
              localidade: postalAdress.cidade,
              uf: postalAdress.estado,
            })
          }} show={showModal}>
            <Form onSubmit={(e) => onSubmitForm(e)}>
              <Form.Group className="mb-3" controlId="Titulo">
                <Form.Label>Titulo</Form.Label>
                <Form.Control defaultValue={endereco.titulo} placeholder="(Opcional)" onChange={(e) => onChangeEndereco('titulo', e.target.value)} />
              </Form.Group>

              <Row>
                <Col xs={3}>
                  <Form.Group className="mb-3" controlId="cep">
                    <Form.Label>Cep</Form.Label>
                    <Form.Control defaultValue={endereco.cep} type='text' placeholder="Somente Numeros" htmlSize={8} onChange={(e) => onChangeCep(e)} isInvalid={erroCep != ''} required />
                    {erroCep ? <Form.Control.Feedback type='invalid'>{erroCep}</Form.Control.Feedback> : ''}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="rua" as={Col}>
                    <Form.Label>Rua</Form.Label>
                    <Form.Control readOnly={true} value={endereco.logradouro} onChange={(e) => onChangeEndereco('logradouro', e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={2}>
                  <Form.Group controlId="numero">
                    <Form.Label>Numero</Form.Label>
                    <Form.Control defaultValue={endereco.numero} type='number' onChange={(e) => onChangeEndereco('numero', e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="complemento">
                    <Form.Label>Complemento</Form.Label>
                    <Form.Control defaultValue={endereco.complemento} onChange={(e) => onChangeEndereco('complemento', e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group className="mb-3" controlId="bairro" as={Col}>
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control readOnly={true} value={endereco.bairro} onChange={(e) => onChangeEndereco('bairro', e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} controlId="cidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control readOnly={true} value={endereco.localidade} onChange={(e) => onChangeEndereco('localidade', e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control readOnly={true} value={endereco.uf} onChange={(e) => onChangeEndereco('uf', e.target.value)} />
                </Form.Group>
              </Row>

              {erroCadastro ? erroCadastro.map((err) => {
                return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
              }) : ``}

              <Row className="justify-content-md-center" lg={4}>
                <Button variant="primary" type="submit">
                  Alterar
                </Button>
              </Row>
            </Form>
          </ModalLarge >
          : ''
        }
        {showDeleteModal ?
          <ModalExclusion
            objectName='Endereço'
            show={showDeleteModal}
            onConfirm={(e) => deleteAdress(e)}
            onHide={() => setShowDeleteModal(false)}
          />
          : ''
        }
      </>
    </div>
  )
}

export default PostalAdressCard;