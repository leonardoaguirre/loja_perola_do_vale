import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageFooter from '../../components/PageFooter';
import PageHeader from '../../components/PageHeader';
import ProductItem from '../../components/ProductItem';
import SubHeader from '../../components/SubHeader';
import styles from '../../styles/pages/ProductList.module.css';

interface ProductListProps {
    products: Product[];
}

interface Product {
    id: string;
    nome: string;
    marca: string;
    descricao: string;
    valorVenda: number;
    codigoBarra: string;
    quantidade: number;
    peso: number;
    altura: number;
    largura: number;
    comprimento: number;
    imagens: Image[];
    categorias: Category[];
}

interface Image {
    id: string;
    originalName: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

interface Category {
    id: string;
    descricao: string;
}

const ProductList: React.FC<ProductListProps> = (props) => {

    return (
        <div className={styles.container}>
            <PageHeader />
            <SubHeader />
            <div className={styles.productList}>
                <h1>Produtos</h1>
                <ul>
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} />
                    ))}
                </ul>
            </div>
            <PageFooter />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const response = await fetch('http://localhost:3008/Produto/Listar');

    if (response.status == 200) {
        const data = await response.json();
        return {
            props: {
                products: data,
            }
        }
    }
}


export default ProductList;