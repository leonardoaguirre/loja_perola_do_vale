import { toString } from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Header from '../../components/Header';

import LoadingIcon from '../../components/LoadingIcon';
import PageFooter from '../../components/PageFooter';
import ShippingCalc from '../../components/ShippingCalc';
import styles from '../../styles/pages/ProductSearch.module.css';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import Cookies from 'js-cookie';
import api from '../../services/api';

interface ProductSearchProps {
  product: Product;
  fav: Favorite;
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

interface Favorite {
  idFavorito: number;
  favoritado: boolean;
  nFavoritos: number;
}

const ProductSearch: React.FC<ProductSearchProps> = (props) => {

  const { isFallback } = useRouter();
  if (isFallback) {
    return <LoadingIcon />;
  }

  const { user, logoutUser } = useContext(UserContext);

  const [mainImage, setMainImage] = useState<string>(`http://localhost:3008/${props.product.imagens[0].path}`);

  const [favorite, setFavorite] = useState<Favorite>({ idFavorito: null, favoritado: false, nFavoritos: 0 });
  const [favImg, setFavImg] = useState<string>('/icons/favorite_border_gray_36dp.svg');

  useEffect(() => {
    const idPessoa = Cookies.getJSON('user').idPessoa;

    api.get(`http://localhost:3008/favorito/verificaFavorito/${idPessoa}/${props.product.id}`).then((res) => {
      setFavorite(res.data);
    }).catch((res) => {
      console.log(res);
    });
    
  }, [])

  useEffect(() => {
    if (favorite.favoritado) {
      setFavImg('/icons/favorite_red_36dp.svg');
    } else {
      setFavImg('/icons/favorite_border_gray_36dp.svg');
    }
  }, [favorite])

  const handleImagePick = (event) => {
    setMainImage(event.target.src);
  }

  const handleFavorite = async (event) => {
    if (favorite.favoritado) {
      // desfavoritar
      api.delete('http://localhost:3008/favorito/deletarPorId', {
        data: {
          idFavorito: favorite.idFavorito
        }
      }).then((res) => {
        setFavorite({
          idFavorito: null,
          favoritado: false,
          nFavoritos: favorite.nFavoritos - 1
        })
        setFavImg('/icons/favorite_border_gray_36dp.svg')
      }).catch((res) => {
        console.log(res);
      });

    } else {
      // favoritar

      api.post('http://localhost:3008/favorito/adicionar', {
        idPessoa: user.idPessoa,
        idProduto: props.product.id
      }).then((res) => {
        setFavorite({
          idFavorito: res.data.idFavorito,
          favoritado: true,
          nFavoritos: favorite.nFavoritos + 1
        })
        setFavImg('/icons/favorite_red_36dp.svg')
      }).catch((res) => {
        console.log(res);
      });
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      <Navigation />
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
                <figure className={styles.imageItem} key={index}>
                  <img src={`http://localhost:3008/${props.product.imagens[index].path}`} alt={props.product.nome} onClick={handleImagePick} />
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
            <strong className={styles.currentPrice}><span className={styles.currence}>R$</span>{parseFloat(toString(props.product.valorVenda)).toFixed(2).replace('.', ',')}</strong>
            <span className={styles.installment}><span className={styles.times}>10x</span> de <span className={styles.currence}>R$</span> <span className={styles.dividedValue}>{(props.product.valorVenda / 10).toFixed(2).replace('.', ',')}</span> sem juros</span>
            <div className={styles.fav}>
              <Button variant="outline-primary" onClick={handleFavorite}>
                <img
                  className={styles.favImg}
                  src={favImg}
                  alt="Coração"
                  title="Favoritar"
                />
                <div className={styles.favCont}>
                  {favorite.nFavoritos}
                </div>
              </Button>{' '}
            </div>
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
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3008/produto/listar`);
  const data = await response.json();

  const paths = data.map(product => {
    return { params: { id: product.id } }
  });

  return {
    paths,
    fallback: true
  }

}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  // const { user } = context;

  // const idPessoa = 'aa02c964-3898-46d5-a497-ad0baf67471b';

  const response = await fetch(`http://localhost:3008/produto/buscarporid/${id}`);
  const data = await response.json();

  // const responseFav = await fetch(`http://localhost:3008/favorito/verificaFavorito/${idPessoa}/${id}`);
  // const dataFav = await responseFav.json();

  // console.log(dataFav);

  return {
    props: {
      product: data
    }
  }
}

export default ProductSearch;