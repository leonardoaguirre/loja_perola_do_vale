import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { ProductCartItem } from '../models/ProductCartItem';

interface CartContextData {
    cartProducts: ProductCartItem[];
    addToCart: (product: ProductCartItem) => void;
    removeFromCart: (idProd: string) => void;
    changeQt: (idProd: string, n: number) => boolean;
    clearCart: () => void;
}

interface CartContextProviderProps {
    children: ReactNode;
}

const initialState = Cookies.getJSON('cartProducts')
export const CartContext = createContext({ cartProducts: initialState } as CartContextData);

export function CartProvider({ children }: CartContextProviderProps) {
    const [cartProducts, setCartProducts] = useState<ProductCartItem[]>([]);
    const router = useRouter();

    useEffect(() => {//hook para persistir os produtos no context
        const cartProducts: ProductCartItem[] = JSON.parse(localStorage.getItem('cartProducts'));// captura o vetor presente no cookie

        if (cartProducts && initialState) {//verifica se o vetor nao esta vazio 

            //Verifica a sincronia entre o local storage e os cookies se algum foi alterados
            let diferente = cartProducts.find((prod, i) => prod.id != initialState[i].id)

            if (diferente) clearCart()

            setCartProducts(cartProducts);//armazena o vetor de produtos no context
        }
    }, []);

    function addToCart(product: ProductCartItem) {
        const newProds: ProductCartItem[] = removeFromCart(product.id)//redundancia, caso seja adicionado um prod que já esta no carrinho, remove e o adiciona novamente
        newProds.push(product)

        setCartProducts(newProds)
        Cookies.set('cartProducts', newProds.map(prod => { return { id: prod.id } }));
        localStorage.setItem('cartProducts', JSON.stringify(newProds))
    }

    function removeFromCart(idProd: string) {
        const newProds = cartProducts.filter(prod => prod.id !== idProd)// retira o produto do vetor com base no id do produto
        // armazena o novo vetor no cookie e no context
        setCartProducts(newProds)
        Cookies.set('cartProducts', newProds.map(prod => { return { id: prod.id } }))
        localStorage.setItem('cartProducts', JSON.stringify(newProds))

        //redireciona para o cart para dar reload e exibbir o novo vetor de produtos
        router.push('/user/cart');
        return newProds//retorna o vetor para a redundancia do addToCart()
    }

    function changeQt(idProd: string, n: number): boolean {
        const index = cartProducts.findIndex(prod => prod.id == idProd)//procura o index no vetor que representa o produto com base no id do produto

        if (n >= 1) {//verifica se a quantidade e maior ou igual a 1 para nao zerar a quantidade
            const newProds = cartProducts;
            newProds[index].quantidade = n;//armazena a nova quantidade que foi passada

            // armazena o novo vetor no cookie e no context
            setCartProducts(newProds)
            Cookies.set('cartProducts', newProds.map(prod => { return { id: prod.id } }))
            localStorage.setItem('cartProducts', JSON.stringify(newProds))

            return true
        } else {
            return false
        }
    }
    function clearCart() {
        Cookies.remove('cartProducts');
        localStorage.removeItem('cartProducts');
        setCartProducts([])
    }

    return (
        <CartContext.Provider
            value={{
                cartProducts,
                addToCart,
                removeFromCart,
                changeQt,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
