import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import LoadingIcon from '../../components/LoadingIcon';
import PageFooter from '../../components/PageFooter';
import PageHeader from '../../components/PageHeader';
import styles from '../../styles/pages/ProductSearch.module.css';

interface ProductProps {
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

const ProductSearch = ({ product }) => {
    const { isFallback } = useRouter();
    if (isFallback) {
        return <LoadingIcon />;
    }
    return (
        <div className={styles.container}>
            <PageHeader />
            <div className={styles.productSearch}>
                <section className={styles.product}>
                    <figure>
                        <img src={`http://localhost:3008/${product.imagens[0].path}`} alt={product.nome} title={product.nome} />
                    </figure>
                    <div>
                        <h1>{product.nome}</h1>
                    </div>
                </section>
                <section className={styles.buy}>

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