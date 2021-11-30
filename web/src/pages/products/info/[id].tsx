import { toString } from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import FavoriteButton from '../../../components/FavoriteButton';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import LoadingIcon from '../../../components/LoadingIcon';
import Nav from '../../../components/Nav';
import Shipping from '../../../components/Shipping';
import { CartContext } from '../../../contexts/CartContext';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/Product';
import api from '../../../services/api';
import { Utils } from '../../../shared/classes/utils';
import styles from './styles.module.css';

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

  const { addToCart } = useContext(CartContext)

  const [mainImage, setMainImage] = useState<string>(`${environment.API}/${props.product.imagens[0].path}`);

  const [produtoAtual, setProdutoAtual] = useState<Product[]>([{ ...props.product, quantidade: 1 }])

  const handleImagePick = (event) => {
    setMainImage(event.target.src);
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
    <div className="pageContainer">
      <Head><title>{props.product.nome} | Ferragens Pérola do Vale</title></Head>
      <Header />
      <Nav />
      <div className="pageContent">
        <Container fluid>
          <Row className={styles.row}>
            <Col xs={12} lg={8}>
              <section className={styles.product}>
                <Row>
                  <Col xs={12} sm={6} md={6} xl={6}>
                    <div className={styles.imageContainer}>
                      <div className={styles.image}>
                        <figure className={styles.mainImage}>
                          <img src={mainImage} alt={props.product.nome} title={props.product.nome} />
                        </figure>
                      </div>
                      <div className={styles.imageCollection}>
                        <div className={styles.arrow}>
                          <MdKeyboardArrowLeft
                            color="black"
                            size={36}
                          />
                        </div>
                        {props.product.imagens.map((img, index) => (
                          <div className={styles.figureContainer} key={index}>
                            <figure className={styles.imageItem}>
                              <img src={`${environment.API}/${props.product.imagens[index].path}`} alt={props.product.nome} onClick={handleImagePick} />
                            </figure>
                          </div>
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
                  <Col xs={12} sm={6} md={6} xl={6}>
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
                      <strong className={styles.currentPrice}><span className={styles.currence}>R$</span>{Utils.formatMoney(props.product.valorVenda)}</strong>
                      <span className={styles.installment}><span className={styles.times}>10x</span> de <span className={styles.currence}>R$</span> <span className={styles.dividedValue}>{Utils.formatMoney(props.product.valorVenda)}</span> sem juros</span>
                    </div>
                    <div className={styles.fav}>
                      <FavoriteButton productId={props.product.id} />
                    </div>
                  </div>
                  <hr />
                </div>
                {
                  props.disponivel == true ?
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
                        <Button variant="outline-secondary" className={styles.addCart} onClick={() => sendToCart(props.product)}>Adicionar ao carrinho</Button>
                        <Button variant="primary" size="lg" className={styles.buyButton}>Comprar</Button>
                      </div>
                    </>
                    :
                    <h1>Produto Indisponivel</h1>
                }
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