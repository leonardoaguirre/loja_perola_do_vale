import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import path from 'path';

import LoadingIcon from '../../components/LoadingIcon';
import PageFooter from '../../components/PageFooter';
import PageHeader from '../../components/PageHeader';
import SubHeader from '../../components/SubHeader';

import styles from '../../styles/pages/ProductList.module.css';
import { toString } from 'lodash';
import ProductItem from '../../components/ProductItem';

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

    const [hasDiscount, setHasDiscount] = useState(false);

    const handleClickProductItem = () => {
        
    }

    useEffect(() => {

    }, [])

    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }

    return (
        <div className={styles.container}>
            <PageHeader />
            <SubHeader />
            <div className={styles.productList}>
                <h1>Produtos</h1>
                <ul>
                    {props.products.map((product, index) => (
                        <ProductItem product={product} index={index} key={index} />
                    ))}
                </ul>
            </div>
            <PageFooter />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    // const response = await fetch(`http://localhost:3008/produto/listar`);
    // const data = await response.json();

    const paths = [{
        params: { search: '' }
    }]

    return {
        paths,
        fallback: true
    }

}

export const getStaticProps: GetStaticProps = async (context) => {
    const { search } = context.params;

    const response = await fetch(`http://localhost:3008/produto/procurar/${search}`);
    const data = await response.json();

    console.log(data, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    return {
        props: {
            products: data,
        }
    }
}

export default ProductList;