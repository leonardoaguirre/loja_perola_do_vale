import { useEffect, useState } from 'react';

import styles from './styles.module.css';
import api from '../../services/api';
import { Product } from '../../models/Product'
import { Adress } from '../../models/Costumer';
interface ShippingCalcProps {
  produtos: Product[];
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
  const [cepPesquisa, setCepPesquisa] = useState<string>(props.freteAuto ? props.freteAuto.cep : '');
  const [fretes, setFretes] = useState<Shipping[]>([]);
  const [cep, setCep] = useState<Cep>();
  const [msgErro, setMsgErro] = useState<string>('');
  const [tipoEntrega, setTipoEntrega] = useState<number>()
  const [inputCepdisabled, setInputCepdisabled] = useState<boolean>(false)

  const calcShipping = async () => {
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

              setCep(res_cep.data);
              setFretes(res_frete.data);
              setIsRequestSuccess(true);
              setMsgErro("");
              setTipoEntrega(0)
            }
          ).catch(
            (error) => {
              console.log(error);
              setIsRequestSuccess(false);
            }
          )
        }
      ).catch(
        (error) => {
          console.log(error);
          setMsgErro("Cep não encontrado!")
          setIsRequestSuccess(false);
        }
      )
    } else {
      setMsgErro("Cep inválido!");
    }
  }

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
      <div className={styles.search}>
        <input type="text" name="cep" value={cepPesquisa} placeholder="CEP" onChange={event => setCepPesquisa(event.target.value)} required disabled={inputCepdisabled} />
        <button onClick={calcShipping} disabled={inputCepdisabled}>Buscar</button>
      </div>
      {isRequestSuccess ?
        <div>
          <div className={styles.postalAdress}>{`${cep.logradouro}, ${cep.bairro}, ${cep.localidade}, ${cep.uf}`}</div>
          <div><strong>Tipo de Entrega</strong></div>
          <table>
            <tbody>
              <input type="radio" name="radio-sedex" id="radio-sedex" checked={tipoEntrega == 0} onChange={() => setTipoEntrega(0)} />
              <tr>
                <td className={styles.tipo}>Sedex</td>
                <td className={styles.prazo}>{`${fretes[0].PrazoEntrega} dias úteis`}</td>
                <td className={styles.valor}>R${fretes[0].Valor}</td>
              </tr>
              <input type="radio" name="radio-pac" id="radio-pac" checked={tipoEntrega == 1} onChange={() => setTipoEntrega(1)} />
              <tr>
                <td className={styles.tipo}>PAC</td>
                <td className={styles.prazo}>{`${fretes[1].PrazoEntrega} dias úteis`}</td>
                <td className={styles.valor}>R${fretes[1].Valor}</td>
              </tr>
            </tbody>
          </table>
        </div>
        : msgErro
          ? <div>{msgErro}</div>
          : ''}
    </div>
  )
}

export default ShippingCalc;
