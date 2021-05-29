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


const productListTeste: Product[] = [{
    id: "1",
    nome: "Chave de fenda",
    marca: "Phillips",
    descricao: "allahu akbar",
    valorVenda: 89.10,
    codigoBarra: "123",
    quantidade: 1,
    peso: 6,
    altura: 4,
    largura: 1,
    comprimento: 7,
    imagens: [{
        id: "1",
        originalName: "bnasoçrh",
        mimetype: "image/png",
        destination: "/images/chave.jpg",
        filename: "nabeoçjqagadlfj",
        path: "/images/chave.jpg",
        size: 36527
    }],
    categorias: [{
        id: "1",
        descricao: "Ferramenta"
    }]
},
{
    id: "2",
    nome: "chave de fenda abafjse ahseosf jsd ajhofs a baoeadl daogehoa aeaj diajfah dag fhgaoesh fuisfjkad hdads",
    marca: "Phillips",
    descricao: "allahu akbar",
    valorVenda: 128.90,
    codigoBarra: "123",
    quantidade: 1,
    peso: 6,
    altura: 4,
    largura: 1,
    comprimento: 7,
    imagens: [{
        id: "1",
        originalName: "bnasoçrh",
        mimetype: "image/png",
        destination: "/images/chave.jpg",
        filename: "nabeoçjqagadlfj",
        path: "/images/chave.jpg",
        size: 36527
    }],
    categorias: [{
        id: "1",
        descricao: "Ferramenta"
    }]
}]

const ProductList: React.FC<ProductListProps> = (props) => {

    useEffect(() => {

    }, [])

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
                </ul>
            </div>
            <PageFooter />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return (
        {
            props: {
                products: productListTeste
            }
        }
    )
}

export default ProductList;