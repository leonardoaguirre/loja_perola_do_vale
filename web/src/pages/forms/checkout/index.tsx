import { capitalize } from "@material-ui/core";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CardPayment from "../../../components/CardPayment";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import LoadingIcon from "../../../components/LoadingIcon";
import OrderResume from "../../../components/OrderResume";
import PostalAdressCard from "../../../components/PostalAdressCard/Card";
import PostalAdressCardNew from "../../../components/PostalAdressCard/New";
import ShippingCalc from "../../../components/Shipping/ShippingCalc";
import { CartContext } from "../../../contexts/CartContext";
import { Adress, Costumer } from "../../../models/Costumer";
import { Product } from "../../../models/Product"
import api from "../../../services/api";

interface CheckoutProps {
    products: Product[];
    costumer: Costumer;
}

const Checkout: React.FC<CheckoutProps> = (props) => {
    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }

    const { products, clearCart } = useContext(CartContext)
    const [endEntrega, setEndEntrega] = useState<Adress>(props.costumer.pessoaFisica.pessoa.enderecos[0] || null);
    const [tipoPagamento, setTipoPagamento] = useState<number>();
    const [frete, setFrete] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)


    const radioChange = (end: Adress) => {
        setEndEntrega(end);
    }
    const radioPaymentChange = (n: number) => {
        setTipoPagamento(n);
    }

    useEffect(() => {
        if (products.length > 0) {
            setTotal(calculaTotal())
        }
    }, [frete])

    const calculaTotal = () => {
        const valoresProds = props.products.map((prod, i) => { return prod.valorVenda * products[i].quantidade })
        return (valoresProds.reduce((total, num) => total + num, 0) + frete)
    }

    const getFrete = (frete) => {
        setFrete(parseFloat(frete.Valor.replace(',', '.')))
    }

    const checkout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const venda = {
            valorFrete: frete,
            idPessoa: props.costumer.pessoaFisica.pessoa.id,
            formaPagamento: {
                nomeTitular: props.costumer.pessoaFisica.nome,
            },
            destino: endEntrega,
            produtos: products,
        }
        console.log(venda);
        api.post('Venda/Adicionar', venda)
            .then((res) => {
                console.log(res.data);
                clearCart()
                if (res.status === 200) {

                    router.push('/user/orderSuccess')
                }
            }).catch((error) => {
                console.log(error);
            })

    }
    return (
        <>
            <Header />
            <form action="post" onSubmit={(e) => checkout(e)}>
                <div>
                    <h2>Endereco de entrega</h2>
                    {props.costumer.pessoaFisica.pessoa.enderecos.length > 0
                        ?
                        props.costumer?.pessoaFisica.pessoa.enderecos.map((end, index) => {
                            return (
                                <div key={index}>
                                    <label>
                                        <input type="radio" name={`${index}`} id={`radio-${index}`}
                                            checked={end === endEntrega} onChange={e => radioChange(end)} />
                                        <PostalAdressCard postalAdress={end} />
                                    </label>
                                </div>

                            )
                        })
                        :
                        <PostalAdressCardNew />
                    }
                </div>
                <div>
                    {products.length > 0 && endEntrega ?
                        <>
                            <h2>Opcoes de frete</h2>
                            <ShippingCalc produtos={products} getFrete={getFrete} freteAuto={endEntrega} ></ShippingCalc>
                        </>
                        : ``
                    }

                </div>
                {frete > 0 ?
                    <>
                        <div>
                            <h2>Resumo da compra</h2>
                            {
                                <OrderResume products={products} frete={frete} />
                            }
                        </div>
                        <div>
                            <h2>Formas de pagamento</h2>
                            <label>
                                <input type="radio" checked={tipoPagamento == 1} onChange={e => radioPaymentChange(1)} />
                                Cartão
                            </label>
                            <label>
                                <input type="radio" checked={tipoPagamento == 2} onChange={e => radioPaymentChange(2)} />
                                Boleto
                            </label>
                            {
                                tipoPagamento == 1 ? <CardPayment valorTotal={total} />
                                    : tipoPagamento == 2 ? <h3>Clique em Finalizar compra</h3> : ``
                            }
                            <h3>Total da Compra: R${total.toFixed(2).replace('.', ',')}</h3>
                        </div>
                        <button type="submit">Finalizar Compra</button>
                    </>
                    : ''}
            </form>
            <Footer />
        </>
    )

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { user, cartProducts } = context.req.cookies;

    if (!cartProducts) {
        return {
            redirect: {
                destination: '/user/cart',
                permanent: false,
            }
        }
    }

    if (user) {
        const userData = JSON.parse(user);

        const responseUser = await fetch(`http://localhost:3008/cliente/BuscaPorId/${userData.id}`);

        const cookieProds = JSON.parse(cartProducts);
        let prods: Product[] = [];

        for (const prod of cookieProds) {
            const response = await fetch(`http://localhost:3008/Produto/BuscarPorId/${prod.id}`)
            const dat = await response.json()
            prods.push(dat)
        }

        if (responseUser.status == 200 && prods.length > 0) {
            const userData = await responseUser.json();
            return {
                props: {
                    costumer: userData,
                    products: prods,
                }
            }
        }
    }

    return {
        redirect: {
            destination: '/user/login',
            permanent: false,
        },
    }

}
export default Checkout;