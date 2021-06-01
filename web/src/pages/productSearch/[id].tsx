import { toString } from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import LoadingIcon from '../../components/LoadingIcon';
import PageFooter from '../../components/PageFooter';
import PageHeader from '../../components/PageHeader';
import ShippingCalc from '../../components/ShippingCalc';
import SubHeader from '../../components/SubHeader';
import styles from '../../styles/pages/ProductSearch.module.css';

interface ProductSearchProps {
    product: Product;
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

const ProductSearch: React.FC<ProductSearchProps> = (props) => {

    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }
    
    const [mainImage, setMainImage] = useState<string>(`http://localhost:3008/${props.product.imagens[0].path}`);

    const handleImagePick = (event) => {
        setMainImage(event.target.src);
    }

    return (
        <div className={styles.container}>
            <PageHeader />
            <SubHeader />
            <div className={styles.productSearch}>
                <section className={styles.product}>
                    <div className={styles.imageContainer}>
                        <figure className={styles.mainImage}>
                            <img src={mainImage} alt={props.product.nome} title={props.product.nome} />
                        </figure>
                        <div className={styles.imageCollection}>
                            <MdKeyboardArrowLeft
                                color="black"
                                size={36}
                            />
                            {props.product.imagens.map((img, index) => (
                                    <figure className={styles.imageItem} onClick={handleImagePick} key={index}>
                                        <img src={`http://localhost:3008/${props.product.imagens[index].path}`} alt={props.product.nome} />
                                    </figure>
                            ))}
                            <MdKeyboardArrowRight
                                color="black"
                                size={36}
                            />
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <h1>{props.product.nome}</h1>
                        <section className={styles.generalInfo}>
                            <div className={styles.brand}>{props.product.marca}</div>
                            <hr />
                            <div className={styles.description}>{props.product.descricao}</div>
                            <hr />
                        </section>
                        <section className={styles.phisicsDimentions}>
                            <label htmlFor="dimention">Dimenções: </label>
                            <span className={styles.dimention}>
                                <span className={styles.height} title="altura">{`${props.product.altura} x `}</span>
                                <span className={styles.widht} title="largura">{`${props.product.largura} x `}</span>
                                <span className={styles.length} title="comprimento">{`${props.product.comprimento}`}</span>
                            </span>
                        </section>
                    </div>
                </section>
                <section className={styles.buy}>
                    <div className={styles.price}>
                        <strong className={styles.currentPrice}><span className={styles.currence}>R$</span>{parseFloat(toString(props.product.valorVenda)).toFixed(2)}</strong>
                        <span className={styles.installment}><span className={styles.times}>10x</span> de <span className={styles.currence}>R$</span> <span className={styles.dividedValue}>{(props.product.valorVenda / 10).toFixed(2)}</span> sem juros</span>
                        <hr />
                    </div>
                    <div className={styles.amount}>
                        <label htmlFor="quantidade">Quantidade</label>
                        <select name="quantidade" id="amount">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <ShippingCalc produto={props.product} />
                    <div className={styles.buttonContainer}>
                        <button className={styles.addCart}>Adicionar ao carrinho</button>
                        <button className={styles.buyButton}>Comprar</button>
                    </div>
                </section>
            </div>
            <PageFooter />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    // const response = await fetch(`http://localhost:3008/produto/listar`);
    // const data = await response.json();

    const paths = [{
        params: { id: '' }
    }]

    return {
        paths,
        fallback: true
    }

}

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params;

    const response = await fetch(`http://localhost:3008/produto/buscarporid/${id}`);
    const data = await response.json();

    return {
        props: {
            product: data,
        }
    }
}

export default ProductSearch;