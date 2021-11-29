import { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

import { useToasts } from '../../contexts/ToastContext';
import { Estoque, Lote } from '../../models/Estoque';
import { Product } from '../../models/Product';
import { Provider } from '../../models/Provider';
import api from '../../services/api';
import { Utils } from '../../shared/classes/utils';
import { ModalExclusion, ModalLarge } from '../Modal';
import ProductCard from '../ProductCard';
import styles from './styles.module.css';

interface StockProps {
  show: boolean;
  product: Product
  onClose(show: boolean);
}
const StockResume: React.FC<StockProps> = (props) => {
  const [showResume, setShowResume] = useState<boolean>(props.show)
  const [estoque, setEstoque] = useState<Estoque>(new Estoque)
  const [lineSelected, setLineSelected] = useState(null)
  const [showExclusionModal, setShowExclusionModal] = useState<boolean>(false)
  const [showInsertModal, setShowInsertModal] = useState<boolean>(false)
  const [erroCadastro, setErroCadastro] = useState([]);
  const [lote, setLote] = useState<Lote>(new Lote)
  const [fornecedores, setFornecedores] = useState<Provider[]>([])

  const { addToast } = useToasts()

  useEffect(() => {
    api.get(`Estoque/ProcurarPorProduto/${props.product.id}`)
      .then(res => {
        setEstoque(res.data)
      }).catch(err => {
        console.log(err);
      })
  }, [props])

  //atualiza tabela de lotes quando os modais sao modificados
  useEffect(() => {
    api.get(`Estoque/ProcurarPorProduto/${props.product.id}`)
      .then(res => {
        setEstoque(res.data)
      }).catch(err => {
        console.log(err);
      })
  }, [showExclusionModal, showInsertModal])

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

  const deleteLote = (loteId: string, trIndex: number) => {
    api.delete("Estoque/RemoverLote", {
      data: {
        idLote: loteId
      }
    }).then(
      (res) => {
        if (res.status === 200) {
          addToast({
            title: 'Lote removido',
            content: `O Lote foi removido com sucesso!`,
            delay: 8000,
            autohide: true,
          })
          setLineSelected(null)
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar remover lote`,
            delay: 8000,
            autohide: true,
          })
        }
      }
    ).catch(
      (error) => {
        addToast({
          title: 'Falha',
          content: `${error ? error : `Erro ao tentar remover`}`,
          delay: 8000,
          autohide: true,
        })
      }
    )
    setShowExclusionModal(false);
  }

  const onChangeLote = (field, value) => setLote({ ...lote, [field]: value })

  const onChangeFornecedor = (id, nomefantasia) => setLote({
    ...lote, fornecedor: {
      id: id,
      pessoaJuridica:
      {
        nomeFantasia: nomefantasia,
        cnpj: null,
        pessoa: null,
        pessoaJuridicaId: null
      }
    }
  })

  useEffect(() => {
    //busca os fornecedores somente quando o modal esta aberto
    if (showInsertModal && fornecedores.length < 1) {
      api.get('Fornecedor/ListarNomes')
        .then(res => setFornecedores(res.data))
        .catch(err => console.log(err))
    }
  }, [showInsertModal])

  const onSubmitAddForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    api.post('Estoque/AdicionarLote',
      {
        idProduto: props.product.id,
        idFornecedor: lote.fornecedor.id,
        quantidade: lote.quantidade,
        dtCompra: lote.dtCompra,
      }
    )
      .then(res => {
        if (res.status === 200) {
          addToast({
            title: 'Lote adicionado',
            content: `O Lote foi adicionado com sucesso!`,
            delay: 8000,
            autohide: true,
          })
          closeInsertModal()
          setErroCadastro([])
        } else {
          addToast({
            title: 'Falha',
            content: `Falha ao tentar adicionar lote`,
            delay: 8000,
            autohide: true,
          })
          setErroCadastro(res.data)
        }
      }).catch(err => setErroCadastro(err.response.data))
  }

  const closeInsertModal = () => {
    setShowInsertModal(false);
    setLote(new Lote);
  }

  return (
    <ModalLarge
      fullscreen show={showResume}
      title={`Produto #${props.product.nome}`}
      onHide={() => { setShowResume(false); props.onClose(false); }}>
      <Container fluid>
        <Row>
          <h4>Produto</h4>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center" xs={12} sm={5} md={4}>
            <Col xs={8} sm={12}>
              <ProductCard product={props.product} index={0}></ProductCard>
            </Col>
          </Col>
          <Col xs={12} sm={7} md={8}>
            <Alert className={`d-flex flex-row align-items-center ${styles.alert}`} variant="primary">
              <p>Quantidade disponivel em estoque :</p>
              <strong>{estoque.quantidadeDisponivel ? estoque.quantidadeDisponivel : 0}</strong>
            </Alert>
            <Row>
              <div>
                <h5>
                  Lotes
                </h5>
              </div>
            </Row>
            <div className={styles.loteTable}>
              <table id="table-lotes" className={styles.table}>
                <thead>
                  <tr>
                    <th>Quantidade</th>
                    <th>Data de compra</th>
                    <th>Fornecedor</th>
                  </tr>
                </thead>
                <tbody onClick={selecionaLinha}>
                  {estoque.lotes ? estoque.lotes.map((lote, i) => {
                    return (
                      <tr key={i}>
                        <td>{lote.quantidade}</td>
                        <td>{Utils.showCorrectDate(lote.dtCompra)}</td>
                        <td>{lote.fornecedor.pessoaJuridica.nomeFantasia}</td>
                      </tr>
                    )
                  })
                    :
                    <Row>
                      <tr>
                        Nenhum lote disponivel
                      </tr>
                    </Row>
                  }
                </tbody>
              </table>
              <div className={styles.bContainer}>
                <div className={styles.aContainer}>
                  <div className={styles.actions}>
                    <div className={styles.hover}>
                      <div className={styles.add}>
                        <button
                          title="Adicionar Lote"
                          className={styles.active}
                          onClick={() => setShowInsertModal(true)}
                        >
                          <MdAdd />
                        </button>
                      </div>
                      <div className={styles.delete}>
                        <button
                          title="Excluir"
                          id="deletebtn"
                          className={lineSelected ? styles.active : styles.disabled}
                          onClick={() => setShowExclusionModal(true)}
                          disabled={!lineSelected}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {
        showExclusionModal ?
          <ModalExclusion
            objN='Lote'
            show={showExclusionModal}
            onConfirm={(e) => deleteLote(estoque.lotes[lineSelected.rowIndex - 1].id, lineSelected.rowIndex)}
            onHide={() => setShowExclusionModal(false)}>
          </ModalExclusion>
          : ''
      }
      {
        showInsertModal ?
          <>
            <ModalLarge
              show={showInsertModal}
              title={`Inserir lote para o Produto ${props.product.nome}`}
              onHide={() => closeInsertModal()}>
              <Container >
                <Form onSubmit={(e) => onSubmitAddForm(e)} >
                  <Form.Group className='mb-3' controlId='numero'>
                    <Row className="justify-content-md-center">
                      <Col xs={4}>
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control type='number' value={lote.quantidade}
                          onChange={(e) => onChangeLote('quantidade', e.target.value)} required />
                      </Col>
                      <Col xs={4}>
                        <Form.Label>Data de compra</Form.Label>
                        <Form.Control type='date' value={lote.dtCompra ? Utils.formatDate(lote.dtCompra) : ``}
                          onChange={(e) => onChangeLote('dtCompra', e.target.value)} required />
                      </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                      <Col xs={8}>
                        <Form.Label>Fornecedor</Form.Label>
                        <Form.Select size="lg"
                          onChange={(e) => onChangeFornecedor(e.target.value, e.target.options[e.target.selectedIndex].text)}>
                          <option>Selecione aqui o fornecedor</option>
                          {fornecedores ?
                            fornecedores.map((fornecedor, i) =>
                              <option key={i} value={fornecedor.id}>{fornecedor.pessoaJuridica.nomeFantasia}</option>
                            )
                            :
                            <option>Nenhum fornecedor cadastrado</option>
                          }
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                  {erroCadastro ? erroCadastro.map((err) => {
                    return Object.values(err.constraints).map((tipoErro, key) => <p key={key} style={{ color: `red` }}>{tipoErro}</p>)
                  }) : ``}
                  <Row className="justify-content-md-center">
                    <Col xs={4}>
                      <Button className="w-100" variant="primary" type="submit">
                        Cadastrar Lote
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Container>
            </ModalLarge>
          </>
          : ''
      }
    </ModalLarge >
  )
}
export default StockResume;