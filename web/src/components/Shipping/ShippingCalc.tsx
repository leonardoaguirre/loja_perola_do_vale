import { useState } from 'react';

import styles from './styles.module.css';
import api from '../../services/api';
import { Product } from '../../models/Product'
interface ShippingCalcProps {
  produtos: Product[];
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
  const [cepPesquisa, setCepPesquisa] = useState<string>('');
  const [fretes, setFretes] = useState<Shipping[]>([]);
  const [cep, setCep] = useState<Cep>();
  const [msgErro, setMsgErro] = useState<string>('');


  const calcShipping = async (event) => {
    if (cepPesquisa.length == 8) {
      const frete =
      {
        cep: cepPesquisa,
        produtos: props.produtos
      }

      api.get(`Correios/ConsultaCep/${cepPesquisa}`).then(
        (res_cep) => {
          console.log("ConsultaCep", res_cep);
          api.post("Correios/CalculaFrete", frete).then(
            (res_frete) => {
              console.log("CalculaFrete", res_frete);

              setCep(res_cep.data);
              setFretes(res_frete.data);
              setIsRequestSuccess(true);
              setMsgErro("");
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

  return (
    <div className={styles.shippingCalc}>
      <div className={styles.search}>
        <input type="text" name="cep" placeholder="CEP" onChange={event => setCepPesquisa(event.target.value)} required />
        <button onClick={calcShipping}>Buscar</button>
      </div>
      {isRequestSuccess ?
        <div>
          <div className={styles.postalAdress}>{`${cep.logradouro}, ${cep.bairro}, ${cep.localidade}, ${cep.uf}`}</div>
          <table>
            <thead>
              <tr>
                <th className={styles.tipo}>Tipo de envio</th>
                <th className={styles.prazo}>Estimativa de entrega</th>
                <th className={styles.valor}>Preço</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tipo}>Sedex</td>
                <td className={styles.prazo}>{`${fretes[0].PrazoEntrega} dias úteis`}</td>
                <td className={styles.valor}>R${fretes[0].Valor}</td>
              </tr>
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
