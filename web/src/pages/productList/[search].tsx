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
                        <li key={index} className={styles.item}>

                            <Link href={`/productSearch/${product.id}`}>
                                <a onClick={handleClickProductItem}>
                                    <div className={styles.itemContainer}>
                                        <header>
                                            {hasDiscount
                                                ? <div className={styles.discount}>-10%</div>
                                                : ''}
                                        </header>
                                        {hasDiscount
                                            ? <div className={`${styles.content} ${styles.hasDiscount}`}>
                                                <figure>
                                                    <img src={`http://localhost:3008/${product.imagens[0].path}`} alt={product.nome} title={product.nome} />
                                                </figure>
                                                <h2>{product.nome.length > 93
                                                    ? `${product.nome.slice(0, 93)}...`
                                                    : product.nome}
                                                </h2>
                                                <div className={styles.price}>
                                                    <strong className={styles.oldPrice}><span>R$</span>{(product.valorVenda * 1.1).toFixed(2)}</strong>
                                                    <strong className={styles.currentPrice}><span>R$</span>{parseFloat(toString(product.valorVenda)).toFixed(2)}</strong>
                                                    <span className={styles.installment}>10x de R$ {`${(product.valorVenda / 10).toFixed(2)} sem juros`}</span>
                                                </div>
                                            </div>
                                            : <div className={styles.content}>
                                                <figure>
                                                    <img src={`http://localhost:3008/${product.imagens[0].path}`} alt={product.nome} />
                                                </figure>
                                                <h2>{product.nome.length > 93
                                                    ? `${product.nome.slice(0, 93)}...`
                                                    : product.nome}
                                                </h2>
                                                <div className={styles.price}>
                                                    <strong className={styles.currentPrice}><span>R$</span>{parseFloat(toString(product.valorVenda)).toFixed(2)}</strong>
                                                    <span className={styles.installment}>10x de R$ {`${(product.valorVenda / 10).toFixed(2)} sem juros`}</span>
                                                </div>
                                            </div>}
                                    </div>
                                </a>
                            </Link>
                        </li>
                    ))}
                    {/* {props.products.map((product, index) => (
                        <li key={index} className={styles.item}>
                            <Link href="/">
                                <a>
                                    <div className={styles.itemContainer}>
                                        <figure>
                                            <img src={`http://localhost:3008/${product.imagens[0].path}`} alt={product.nome} />
                                        </figure>
                                        <h2>{product.nome}</h2>
                                        <strong>R$ {parseFloat(toString(product.valorVenda)).toFixed(2)}</strong>
                                        <span>10x de R$ {`${(product.valorVenda / 10).toFixed(2)} sem Juros`}</span>
                                    </div>
                                </a>
                            </Link>
                        </li>
                    ))} */}
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

    return {
        props: {
            products: data,
        }
    }
}

export default ProductList;