import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ImHeartBroken } from 'react-icons/im';
import { IoIosArrowBack } from 'react-icons/io';

import FavoriteItem from '../../../components/FavoriteItem';
import Header from '../../../components/Header';
import { environment } from '../../../environments/environment';
import { Favorite } from '../../../models/Favorite';
import api from '../../../services/api';
import styles from './styles.module.css';

interface FavoritesProps {
  favorites: Favorite[];
}

const Favorites: React.FC<FavoritesProps> = (props) => {

  const [nfavorites, setNfavorites] = useState<number>(props.favorites?.length);
  const [favorites, setFavorites] = useState<Favorite[]>(props.favorites);

  const deleteFavorite = (idFavorito: number) => {
    api.delete(`${environment.API}/favorito/deletarPorId`, {
      data: {
        idFavorito: idFavorito
      }
    }).then((res) => {
      setNfavorites(nfavorites - 1);
      setFavorites(favorites.filter((favorite) => favorite.id != idFavorito));
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className="pageContainer">
      <Head><title>Meus Favoritos | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div id="favorite" className="pageContent fx-column">
        <h1>Meus Favoritos</h1>
        {((nfavorites > 0) ?
          (
            <div className={styles.fav}>
              {favorites.map((favorite, index) => {
                return <FavoriteItem favorite={favorite} deleteFavorite={deleteFavorite} index={index} key={index} />
              })}
            </div>
          ) : (
            <div className={styles.noFav}>
              <div className={styles.content}>
                <ImHeartBroken />
                <div className={styles.right}>
                  <h2>Você não possui nenhum favorito!</h2>
                  <Link href={'/'}>
                    <a>
                      <Button id={styles.backToBuy} variant="primary"><IoIosArrowBack />Encontrar Produtos</Button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.req.cookies;
  const userData = JSON.parse(user);

  const data = await fetchData(userData.idPessoa);

  return {
    props: {
      favorites: data.favorites
    }
  }
}

const fetchData = async (idPessoa) => await
  api.get(`favorito/ListarPorPessoa/${idPessoa}`)
    .then(res => ({
      error: false,
      favorites: res.data,
    }))
    .catch(() => ({
      error: true,
      favorites: null,
    }));

export default Favorites;