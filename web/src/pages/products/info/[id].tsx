import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { toString } from 'lodash';
import { useContext, useState, useEffect } from 'react';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { UserContext } from '../../../contexts/UserContext';
import api from '../../../services/api';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Nav from '../../../components/Nav';
import LoadingIcon from '../../../components/LoadingIcon';
import Shipping from '../../../components/Shipping/ShippingCalc';

import styles from './styles.module.css';
import { CartContext } from '../../../contexts/CartContext';
import { Product } from '../../../models/Product';
import { environment } from '../../../environments/environment';

interface ProductSearchProps {
  product: Product;
  fav: Favorite;
  disponivel: boolean;
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

  const { user } = useContext(UserContext);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [mainImage, setMainImage] = useState<string>(`${environment.API}/${props.product.imagens[0].path}`);

  const [favorite, setFavorite] = useState<Favorite>({ idFavorito: null, favoritado: false, nFavoritos: 0 });
  const [favImg, setFavImg] = useState<string>('/icons/favorite_border_gray_36dp.svg');

  const [produtoAtual, setProdutoAtual] = useState<Product[]>([{ ...props.product, quantidade: 1 }])

  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const user = Cookies.getJSON("user");
    let idPessoa = '';
    if (user) {
      idPessoa = user.idPessoa;
      setIsDisabled(false);
    }
    // buscar dados de favorito
    api.get(`favorito/verificaFavorito/${props.product.id}?idPessoa=${user ? idPessoa : ''}`).then((res) => {
      setFavorite(res.data);
    }).catch((res) => {
      console.log(res);
    });
  }, []);

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
      api.delete(`${environment.API}/favorito/deletarPorId`, {
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

      api.post(`${environment.API}/favorito/adicionar`, {
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

  const sendToCart = (prod: Product) => {//envia as informacoes do produto mostrado ao context do carrinho
    addToCart({
      id: prod.id,
      altura: prod.altura,
      largura: prod.largura,
      comprimento: prod.comprimento,
      peso: prod.peso,
      quantidade: produtoAtual[0].quantidade,
      nome: prod.nome,
      marca: prod.marca,
      descricao: prod.descricao,
      valorVenda: prod.valorVenda,
      codigoBarra: prod.codigoBarra,
      imagens: prod.imagens,
      categorias: prod.categorias
    })
  }

  const getQtd = () => {// onChange do select de quantidade do produto
    const qt = document.getElementById('amount') as HTMLSelectElement //captura a quantidade do select option

    const p = produtoAtual // clona o produto atual via hook

    p[0].quantidade = parseInt(qt.value) //atribui a quantidade selecionada
    setProdutoAtual(p)//atibui corretamente ao hook a quantidade selecionada
  }

  const getF = () => { }//metodo vazio para implementar getFrete shippingcalc erro getFrete is Not a function por causa do reaproveitamento do componente

  return (
    <div className={styles.container}>
      <Head>
        <title>{props.product.nome} | Ferragens Pérola do Vale</title>
      </Head>
      <Header />
      <Nav />
      <div className={styles.productSearch}>
        <Container>
          <Row className={styles.row}>
            <Col xs={12} lg={8}>
              <section className={styles.product}>
                <Row>
                  <Col xs={12} md={6} xl={6}>
                    <div className={styles.imageContainer}>
                      <figure className={styles.mainImage}>
                        <img src={mainImage} alt={props.product.nome} title={props.product.nome} />
                      </figure>
                      <div className={styles.imageCollection}>
                        <div className={styles.arrow}>
                          <MdKeyboardArrowLeft
                            color="black"
                            size={36}
                          />
                        </div>
                        {props.product.imagens.map((img, index) => (
                          <figure className={styles.imageItem} key={index}>
                            <img src={`${environment.API}/${props.product.imagens[index].path}`} alt={props.product.nome} onClick={handleImagePick} />
                          </figure>
                        ))}
                        <div className={styles.arrow}>
                          <MdKeyboardArrowRight
                            color="black"
                            size={36}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <div className={styles.infoContainer}>
                      <h1>{props.product.nome}</h1>
                      <section className={styles.generalInfo}>
                        <div className={styles.brand}>{props.product.marca}</div>
                        <hr />
                        <div className={styles.description}>{props.product.descricao}</div>
                        <hr />
                      </section>
                      <section className={styles.phisicsDimentions}>
                        <label htmlFor="dimention">Dimensões: </label>
                        <span className={styles.dimention}>
                          <span className={styles.height} title="altura">{`${props.product.altura} x `}</span>
                          <span className={styles.widht} title="largura">{`${props.product.largura} x `}</span>
                          <span className={styles.length} title="comprimento">{`${props.product.comprimento}`}</span>
                        </span>
                      </section>
                    </div>
                  </Col>
                </Row>
              </section>
            </Col>
            <Col xs={12} lg={4}>
              <section className={styles.buy}>
                <div>
                  <div className={styles.price}>
                    <div className={styles.right}>
                      <strong className={styles.currentPrice}><span className={styles.currence}>R$</span>{parseFloat(toString(props.product.valorVenda)).toFixed(2).replace('.', ',')}</strong>
                      <span className={styles.installment}><span className={styles.times}>10x</span> de <span className={styles.currence}>R$</span> <span className={styles.dividedValue}>{(props.product.valorVenda / 10).toFixed(2).replace('.', ',')}</span> sem juros</span>
                    </div>
                    <div className={styles.fav}>
                      <Button id="btnfav" variant="outline-primary" onClick={handleFavorite} disabled={isDisabled}>
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
                  </div>
                  <hr />
                </div>
                {/* {props.disponivel == true ?
                  <>
                    <div className={styles.amount}>
                      <label htmlFor="quantidade">Quantidade</label>
                      <select name="quantidade" id="amount" onChange={() => getQtd()}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>
                    </div>
                    <div className={styles.shipping}>
                      <Shipping produtos={produtoAtual} getFrete={getF} />
                    </div>
                    <div className={styles.buttonContainer}>
                      <button className={styles.addCart} onClick={() => sendToCart(props.product)}>Adicionar ao carrinho</button>
                      <button className={styles.buyButton}>Comprar</button>
                    </div>
                  </>
                  :
                  <h1>Produto Indisponivel</h1>
                } */}

                <div className={styles.amount}>
                  <label htmlFor="quantidade">Quantidade</label>
                  <select name="quantidade" id="amount" onChange={() => getQtd()}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
                <div className={styles.shipping}>
                  <Shipping produtos={produtoAtual} getFrete={getF} />
                </div>
                <div className={styles.buttonContainer}>
                  <button className={styles.addCart} onClick={() => sendToCart(props.product)}>Adicionar ao carrinho</button>
                  <button className={styles.buyButton}>Comprar</button>
                </div>

              </section>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${environment.API}/produto/listar`);
  const data = await response.json();

  const paths = data.map(product => {
    return { params: { id: '' } }
  });

  return {
    paths,
    fallback: true,
  }

}

const fetchData = async (url: string) => await
  api.get(url)
    .then(res => ({
      error: false,
      data: res.data
    }))
    .catch(() => ({
      error: true,
      data: null,
    }));


export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const { data } = await fetchData(`Produto/BuscarporId/${toString(id)}`);

  return {
    props: {
      product: data.produto,
      disponivel: data.disponivel
    },
    revalidate: 5 // em build 600
  }
}

export default ProductSearch;