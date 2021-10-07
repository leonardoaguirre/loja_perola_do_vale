import { useEffect, useState } from "react";
import { Product } from "../../models/Product";

interface OrderResumeProps {
    products: Product[];
    frete: number;
}

const OrderResume: React.FC<OrderResumeProps> = (props) => {
    const [frete, setFrete] = useState<number>(props.frete)

    useEffect(() => {
        setFrete(props.frete)
    }, [props])
    
    return (
        <>
            {props.products ?
                <table>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>Nome</td>
                            <td>Quantidade</td>
                            <td>Preço</td>
                        </tr>
                    </thead>

                    <tbody>
                        {props.products.map((prod, i) => {
                            return (
                                <tr id={`item-${prod.id}`}>
                                    <td>
                                        <img src={`http://localhost:3008/${prod.imagens[0].path}`}
                                            alt={prod.nome} title={prod.nome} width={50} height={50} />
                                    </td>
                                    <td>{prod.nome}</td>
                                    <td>{prod.quantidade}</td>
                                    <td><span>R$</span>{parseFloat(prod.valorVenda.toString()).toFixed(2).replace('.', ',')}</td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                    <label>Subtotal: <span>R${props.products.map((prod, i) => { return (prod.valorVenda * prod.quantidade).toFixed(2).replace('.', ',') })}</span></label>
                    <label>Frete: <span>R${frete.toFixed(2).replace('.', ',')}</span></label>
                </table>


                :
                <h3>Voce nao possui nenhum produto no carrinho</h3>
            }
        </>

    )
}
export default OrderResume;