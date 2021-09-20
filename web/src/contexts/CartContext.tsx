import React from 'react';
import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface Product {
    id: string;
    qtd: number;
}

interface CartContextData {
    products: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (idProd: string) => void;
    changeQt: (idProd: string, n: number) => void;
}

interface CartContextProviderProps {
    children: ReactNode;
}

const initialState = Cookies.getJSON('cartProducts')
export const CartContext = createContext({ products: initialState } as CartContextData);

export function CartProvider({ children }: CartContextProviderProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {//hook para persistir os produtos no context
        const cartProducts: Product[] = Cookies.getJSON('cartProducts');// captura o vetor presente no cookie

        if (cartProducts) {//verifica se o vetor nao esta vazio 
            setProducts(cartProducts);//armazena o vetor de produtos no context
        }

    }, []);

    function addToCart(product: Product) {
        const newProds: Product[] = removeFromCart(product.id)//redundancia, caso seja adicionado um prod que já esta no carrinho, remove e o adiciona novamente
        newProds.push(product)

        setProducts(newProds)
        Cookies.set('cartProducts', newProds);
    }

    function removeFromCart(idProd: string) {
        const newProds = products.filter(prod => prod.id !== idProd)// retira o produto do vetor com base no id do produto

        // armazena o novo vetor no cookie e no context
        setProducts(newProds)
        Cookies.set('cartProducts', newProds)

        //redireciona para o cart para dar reload e exibbir o novo vetor de produtos
        router.push('/User/Cart');
        return newProds//retorna o vetor para a redundancia do addToCart()
    }

    function changeQt(idProd: string, n: number) {
        const index = products.findIndex(prod => prod.id == idProd)//procura o index no vetor que representa o produto com base no id do produto

        if (products[index].qtd >= 1) {//verifica se a quantidade e maior ou igual a 1 para nao zerar a quantidade
            const newProds = products;
            newProds[index].qtd = n;//armazena a nova quantidade que foi passada
            
            // armazena o novo vetor no cookie e no context
            setProducts(newProds)
            Cookies.set('cartProducts', newProds)
        } else {
            alert('Quantidade nao pode ser menor que 1');
        }
    }

    return (
        <CartContext.Provider
            value={{
                products,
                addToCart,
                removeFromCart,
                changeQt,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
