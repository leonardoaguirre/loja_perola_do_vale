import { useEffect, useState } from 'react';
import styles from '../styles/components/ShippingCalc.module.css';

interface ShippingCalcProps {
    produto: Product;
}

interface Shipping {
    Codigo: string;
    Valor: string;
    PrazoEntrega: string;
    MsgErro?: string;
}

interface Product {
    peso: number;
    altura: number;
    largura: number;
    comprimento: number;
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
            const frete = {
                body: JSON.stringify({
                    cep: cepPesquisa,
                    peso: props.produto.peso,
                    comprimento: props.produto.comprimento,
                    altura: props.produto.altura,
                    largura: props.produto.largura,
                    diametro: 0
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: "post",
            };

            const responseCep = await fetch(`http://localhost:3008/Correios/ConsultaCep/${cepPesquisa}`);

            if (responseCep.ok) {
                const responseCalc = await fetch("http://localhost:3008/Correios/CalculaFrete", frete)
                const calc = await responseCalc.json();

                if (calc[0].Erro === "0") {
                    const cepJson = await responseCep.json();

                    setCep(cepJson);
                    setFretes(calc);
                    setIsRequestSuccess(true);
                    setMsgErro("");
                } else {
                    setMsgErro(calc[0].MsgErro)
                    setFretes(calc);
                    setIsRequestSuccess(false);
                }
            } else {
                setMsgErro("Cep não encontrado!")
            }

        } else {
            setMsgErro("Cep inválido!");
        }
    }

    return (
        <div className={styles.shippingCalc}>
            <div className={styles.search}>
                <input type="text" name="cep" placeholder="CEP" onChange={event => setCepPesquisa(event.target.value)} required />
                <button onClick={calcShipping}>Confimar</button>
            </div>
            {cep
                ? <div className={styles.postalAdress}>{`${cep.logradouro}, ${cep.bairro}, ${cep.localidade}, ${cep.uf}`}</div>
                : ''}
            {isRequestSuccess
                ? <table>
                    <thead>
                        <th className={styles.tipo}>Tipo de envio</th>
                        <th className={styles.prazo}>Estimativa de entrega</th>
                        <th  className={styles.valor}>Preço</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.tipo}>Sedex</td>
                            <td className={styles.prazo}>{`${fretes[0].PrazoEntrega} dias úteis`}</td>
                            <td className={styles.valor}>{fretes[0].Valor}</td>
                        </tr>
                        <tr>
                            <td className={styles.tipo}>PAC</td>
                            <td className={styles.prazo}>{`${fretes[1].PrazoEntrega} dias úteis`}</td>
                            <td className={styles.valor}>{fretes[1].Valor}</td>
                        </tr>
                    </tbody>
                </table>
                : msgErro
                    ? <div>{msgErro}</div>
                    : ''}
        </div>
    )
}

export default ShippingCalc;
