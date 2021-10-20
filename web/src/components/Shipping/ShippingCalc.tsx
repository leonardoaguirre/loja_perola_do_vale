import { useEffect, useState } from 'react';

import styles from './styles.module.css';
import api from '../../services/api';
import { Product } from '../../models/Product'
import { Adress } from '../../models/Costumer';
import { Card, Placeholder } from 'react-bootstrap';

interface ShippingCalcProps {
  produtos: Product[];
  dontShowInput?: boolean;
  dontShowAdress?: boolean;
  dontShowTable?: boolean;
  hasPlaceholder?: boolean;
  getFrete?(frete: Shipping): void;
  freteAuto?: Adress;
}

interface Shipping {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  MsgErro?: string;
}

interface Cep {
  logradouro: string; // rua
  bairro: string;
  localidade: string; // cidade
  uf: string; //estado
}


const ShippingCalc: React.FC<ShippingCalcProps> = (props) => {

  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cepPesquisa, setCepPesquisa] = useState<string>(props.freteAuto ? props.freteAuto.cep : '');
  const [fretes, setFretes] = useState<Shipping[]>([]);
  const [cep, setCep] = useState<Cep>();
  const [msgErro, setMsgErro] = useState<string>('');
  const [tipoEntrega, setTipoEntrega] = useState<number>()
  const [inputCepdisabled, setInputCepdisabled] = useState<boolean>(false)

  const calcShipping = async () => {
    setIsLoading(true);
    if (cepPesquisa.length == 8) {
      const frete =
      {
        cep: cepPesquisa,
        produtos: props.produtos
      }
      api.get(`Correios/ConsultaCep/${cepPesquisa}`).then(
        (res_cep) => {
          api.post("Correios/CalculaFrete", frete).then(
            (res_frete) => {
              if (res_frete.data.Erro != 0) {
                setCep(res_cep.data);
                setFretes(res_frete.data);
                setIsRequestSuccess(true);
                setMsgErro("");
                setTipoEntrega(0);
                setIsLoading(false);
              } else {
                setMsgErro("Houve uma falha ao realizar o calculo do frete!");
                setIsLoading(false);
              }
            }
          ).catch(
            (error) => {
              console.log(error);
              setIsRequestSuccess(false);
              setIsLoading(false);
            }
          )
        }
      ).catch(
        (error) => {
          console.log(error);
          setMsgErro("Cep não encontrado!")
          setIsRequestSuccess(false);
          setIsLoading(false);
        }
      );
    } else {
      setMsgErro("Cep inválido!");
    }
  }

  useEffect(() => {
    if (isLoading) {
      props.getFrete({Codigo: null, Valor: '0', PrazoEntrega: null, MsgErro: null});
    }
  }, [isLoading])

  useEffect(() => {
    if (fretes.length > 0) {//verifica se o vetor de fretes nao esta vazio
      props.getFrete(fretes[tipoEntrega])//atribui o respectivo frete e o retorna ao componente pai
    }
  }, [tipoEntrega])

  useEffect(() => {
    if (props.freteAuto) {//verifica se e uma chamada automatica
      setInputCepdisabled(true)//deixa disabled o botao buscar e o input
      setCepPesquisa(props.freteAuto.cep)//atribui o cep escolhido pelas opcoes do usuario
    }
  }, [props.freteAuto])

  useEffect(() => {//recalcula o frete quando muda o option de endereco(cepPesquisa)
    if (cepPesquisa.length > 7) calcShipping()
  }, [cepPesquisa])

  return (
    <div className={styles.shippingCalc}>
      {!props.dontShowInput ?
        <div className={styles.search}>
          <input type="text" name="cep" value={cepPesquisa} placeholder="CEP" onChange={event => setCepPesquisa(event.target.value)} required disabled={inputCepdisabled} />
          <button onClick={calcShipping} disabled={inputCepdisabled}>Buscar</button>
        </div>
        :
        ''
      }
      {(isLoading ? (
        <div>
          {(!props.dontShowAdress ? (
            (props.hasPlaceholder ? (
              <Placeholder />
            ) : (
              ''
            ))
          ) : (
            ''
          ))}
          {(!props.dontShowTable ? (
            <>
              {(props.hasPlaceholder ? (
                <>
                  <div><strong>Tipos de Entrega</strong></div>
                  <div className={styles.optionList}>
                    <div className={styles.item}>
                      <input type="radio" name="radio-sedex" id="radio-sedex" />
                      <div className={styles.content}>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={8} size="lg" />
                        </Placeholder>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={10} size="sm" />
                        </Placeholder>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={10} size="sm" />
                        </Placeholder>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <input type="radio" name="radio-pac" id="radio-pac" />
                      <div className={styles.content}>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={8} size="lg" />
                        </Placeholder>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={10} size="sm" />
                        </Placeholder>
                        <Placeholder as="p" aria-hidden="true" animation="wave">
                          <Placeholder xs={10} size="sm" />
                        </Placeholder>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ''
              ))}
            </>
          ) : (
            ''
          ))}
        </div>
      ) : (
        (isRequestSuccess ? (
          <div>
            {(!props.dontShowAdress ? (
              <div className={styles.postalAdress}>{`${cep.logradouro}, ${cep.bairro}, ${cep.localidade}, ${cep.uf}`}</div>
            ) : (
              <></>
            ))}
            {(!props.dontShowTable ? (
              <>
                <div><strong>Tipos de Entrega</strong></div>
                <div className={styles.optionList}>
                  <div className={tipoEntrega == 0 ? `${styles.item} ${styles.selected}` : styles.item} onClick={() => setTipoEntrega(0)}>
                    <input type="radio" name="radio-sedex" id="radio-sedex" checked={tipoEntrega == 0} onChange={() => setTipoEntrega(0)} />
                    <div>
                      <div className={styles.tipo}>Sedex</div>
                      <div className={styles.prazo}>{`${fretes[0].PrazoEntrega} dias úteis`}</div>
                      <div className={styles.valor}>R$ {fretes[0].Valor}</div>
                    </div>
                  </div>
                  <div className={tipoEntrega == 1 ? `${styles.item} ${styles.selected}` : styles.item} onClick={() => setTipoEntrega(1)}>
                    <input type="radio" name="radio-pac" id="radio-pac" checked={tipoEntrega == 1} onChange={() => setTipoEntrega(1)} />
                    <div>
                      <div className={styles.tipo}>PAC</div>
                      <div className={styles.prazo}>{`${fretes[1].PrazoEntrega} dias úteis`}</div>
                      <div className={styles.valor}>R$ {fretes[1].Valor}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            ))}
          </div>
        ) : (
          (msgErro ? (
            <div>{msgErro}</div>
          ) : (
            ''
          ))
        ))
      ))}
    </div>
  )
}

export default ShippingCalc;
