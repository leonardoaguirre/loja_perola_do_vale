import { capitalize } from "@material-ui/core";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { CartContext } from "../../../contexts/CartContext";
import { Product } from "../../../models/Product";
import Shipping from '../../../components/Shipping/ShippingCalc';

interface CartProps {
    products: Product[];
}
const Cart: React.FC<CartProps> = (props) => {
    const { products, addToCart, changeQt, removeFromCart } = useContext(CartContext)

    const [subtotal, setSubTotal] = useState<number>(0);

    useEffect(() => {
        if(products.length>0){
            calcSubtotal()
        }
        
    }, [products])

    const removeItem = (id: string) => {
        const item = document.getElementById(`item-${id}`)
        item.removeChild

        removeFromCart(id);
    }
    const OnChangeQt = (idProd: string, qt: string) => {
        changeQt(idProd, parseInt(qt))
        calcSubtotal()
    }

    const calcSubtotal = () => {
        let sum: number = 0

        props.products.map((prod, i) => {
            sum += prod.valorVenda * products[i].qtd
        })

        setSubTotal(sum);
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
                                        <tr id={`item-${props.products[i].id}`}>
                                            <td>
                                                <Link href={`/Products/Info/${prod.id}`}>
                                                    <a>
                                                        <img src={`http://localhost:3008/${props.products[i].imagens[0].path}`}
                                                            alt={capitalize(props.products[i].nome)} title={capitalize(props.products[i].nome)} width={150} height={150} />
                                                    </a>
                                                </Link>
                                            </td>
                                            <td>{props.products[i].nome}</td>
                                            <td><input type="number" defaultValue={products[i].qtd} onChange={(e) => OnChangeQt(props.products[i].id, e.target.value)} /></td>
                                            <td><span>R$</span>{parseFloat(props.products[i].valorVenda.toString()).toFixed(2).replace('.', ',')}</td>
                                            <td><button onClick={() => removeItem(props.products[i].id)}>X</button></td>
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
                            <label>Total: <span>R${subtotal.toFixed(2).replace(`.`, `,`)}</span></label>
                            <label>Em ate 10x sem juros de R${(subtotal / 10).toFixed(2).replace(`.`, `,`)}</label>
                        </div>
                    </div>
                    <div>
                        <h3>Calcular Frete :</h3>
                        <Shipping produto={props.products[0]}></Shipping>
                    </div>
                    <div>
                        <Link href={"/Products/List/a"} >
                        <a>
                            <button>Continuar Comprando</button>
                        </a>
                        </Link>
                    </div>
                    <div>
                        <button>Finalizar Compra</button>
                    </div>
                </div>
                : ''
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