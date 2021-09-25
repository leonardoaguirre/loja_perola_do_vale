import { capitalize } from "@material-ui/core";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { CartContext } from "../../../contexts/CartContext";
import { Product } from "../../../models/Product";
import Shipping from '../../../components/Shipping/ShippingCalc';
import LoadingIcon from "../../../components/LoadingIcon";
import { useRouter } from "next/router";
import ShippingCalc from "../../../components/Shipping/ShippingCalc";

interface CartProps {
    products: Product[];
}
const Cart: React.FC<CartProps> = (props) => {

    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }

    const { products, changeQt, removeFromCart } = useContext(CartContext)

    const [subtotal, setSubTotal] = useState<number>(0);
    const [frete, setFrete] = useState<number>();

    useEffect(() => {
        if (products.length > 0) {
            calcSubtotal()
        }
    }, [products])

    const removeItem = (id: string) => {
        const item = document.getElementById(`item-${id}`)
        item.removeChild

        removeFromCart(id);
    }

    const OnChangeQt = (idProd: string, e: HTMLInputElement) => {
        if (changeQt(idProd, parseInt(e.value))) {
            calcSubtotal()
        }else{
            e.value = '1'
        }
        
    }

    const calcSubtotal = () => {
        let sum: number = 0

        products.map((prod, i) => {
            sum += props.products[i].valorVenda * prod.quantidade
        })

        setSubTotal(sum);
    }
    const getFrete = (frete)=>{
        console.log(frete.Valor);
        
        setFrete(parseFloat(frete.Valor.replace(',','.')))
    }

    return (
        <>
            <Header />
            <div>
                <h2>Carrinho de Compras</h2>
            </div>
            {products.length > 0 ?
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Produto</td>
                                <td>Nome</td>
                                <td>Quantidade</td>
                                <td>Preço</td>
                                <td>Remover</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((prod, i) => {
                                    return (
                                        <tr id={`item-${prod.id}`}>
                                            <td>
                                                <Link href={`/products/info/${prod.id}`}>
                                                    <a>
                                                        <img src={`http://localhost:3008/${prod.imagens[0].path}`}
                                                            alt={capitalize(prod.nome)} title={capitalize(prod.nome)} width={150} height={150} />
                                                    </a>
                                                </Link>
                                            </td>
                                            <td>{prod.nome}</td>
                                            <td><input type="number" defaultValue={prod.quantidade} onChange={(e) => OnChangeQt(prod.id, e.target)} /></td>
                                            <td><span>R$</span>{parseFloat(props.products[i].valorVenda.toString()).toFixed(2).replace('.', ',')}</td>
                                            <td><button onClick={() => removeItem(prod.id)}>X</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                : <h2>Você não possui nenhum produto no carrinho</h2>
            }
            {products.length > 0 ?
                <div>
                    <div>
                        <div>
                            <h2>Resumo do pedido</h2>
                        </div>
                        <div>
                            <label>{products.length} Produto(s) <span>R${subtotal.toFixed(2).replace(`.`, `,`)}</span></label>
                            <label>Frete: <span>R${frete ? frete.toFixed(2).replace(`.`, `,`) : `--`}</span></label>
                            <label>Total: <span>R${frete ? (subtotal+frete).toFixed(2).replace(`.`, `,`) : subtotal.toFixed(2).replace(`.`, `,`) }</span></label>
                            <label>Em ate 10x sem juros de R${frete ?((subtotal+frete)/10).toFixed(2).replace(`.`, `,`) : (subtotal / 10).toFixed(2).replace(`.`, `,`)}</label>
                        </div>
                    </div>
                    <div>
                        <h3>Calcular Frete :</h3>
                        <ShippingCalc produtos={products} getFrete={getFrete}/>
                    </div>
                    <div>
                        <Link href={"/products/list/a"} >
                            <a>
                                <button>Voltar para as Compras</button>
                            </a>
                        </Link>
                    </div>
                    <div>
                        <Link href={"/forms/checkout"}>
                            <a>
                                <button>Continuar</button>
                            </a>
                        </Link>
                    </div>
                </div>
                : <div>
                    <Link href={"/products/list/a"} >
                        <a>
                            <button>Voltar para as Compras</button>
                        </a>
                    </Link>
                </div>
            }
            <Footer />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { cartProducts } = context.req.cookies;
    let data: Product[] = [];

    if (cartProducts) {
        const prods = JSON.parse(cartProducts);

        for (const prod of prods) {
            const response = await fetch(`http://localhost:3008/Produto/BuscarPorId/${prod.id}`)
            const dat = await response.json()
            data.push(dat)
        }
    }

    return {
        props: {
            products: data
        }
    }
}

export default Cart;