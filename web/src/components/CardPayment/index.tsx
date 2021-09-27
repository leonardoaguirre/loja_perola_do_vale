import { useState } from "react";

interface CardPaymentProps {
    valorTotal : number;
}
const CardPayment: React.FC<CardPaymentProps> = (props) => {
    const [tipoCartao, setTipoCartao] = useState<number>(1)

    const radioChange = (n: number) => {
        setTipoCartao(n)
    }
    const geraParcelas = () =>{
        let parcelas = [] 
        for (let index = 1; index < 11; index++) {
            parcelas.push(<option value={`${index}`}>{index}x de {(props.valorTotal/index).toFixed(2).replace(`.`, `,`)} sem juros</option> )
        }
        return parcelas
    }
    return (
        <>
            <label>
                <input type="radio" checked={tipoCartao == 1} onChange={e => radioChange(1)} />
                Cartão de Débito
            </label>
            <label>
                <input type="radio" checked={tipoCartao == 2} onChange={e => radioChange(2)} />
                Cartão de Crédito
            </label>
            <label>
                Numero do cartão
                <input type="number" name="numeroCartao" id="" />
            </label>
            <label>
                Nome do titular
                <input type="number" name="nomeTitular" id="" />
            </label>
            <label>
                Validade
                <input type="month" name="validade" id="" min={Date.now()}/>
            </label>
            <label>
                cvv
                <input type="number" name="cvv" id="" min={3} max ={3}/>
            </label>
            {tipoCartao == 2?
            <>
            <label>Parcelas:</label>
            <select name="parcelas" id=""> 
                {
                    geraParcelas()
                }
            </select>
            </>
            
            : <h3>1x sem juros de R${(props.valorTotal).toFixed(2).replace('.',',')}</h3>
            }
            
        </>
    )
}
export default CardPayment;