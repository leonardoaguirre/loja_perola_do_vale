import { useState } from 'react';
import { GetServerSideProps } from "next";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FavoriteItem from "../../../components/FavoriteItem";

import { Favorite } from '../../../models/Favorite';

import styles from './styles.module.css';
import api from "../../../services/api";

interface FavoritesProps {
  favorites: Favorite[];
}

const Favorites: React.FC<FavoritesProps> = (props) => {

  const [nfavorites, setNfavorites] = useState<number>(props.favorites?.length);

  const deleteFavorite = (idFavorito: number, index: number) => {
    console.log("deleteFavorite", document.getElementById(`item${index}`));
    api.delete('http://localhost:3008/favorito/deletarPorId', {
        data: {
          idFavorito: idFavorito
        }
      }).then((res) => {
        document.getElementById(`item${index}`).remove();
        setNfavorites(nfavorites - 1);
      }).catch((error) => {
        console.log(error);
      });
  } 

  return (
    <div className={styles.container}>
      <Header />
      {nfavorites > 0 ?
        <div id="favorite" className={styles.favorites}>
        {props.favorites.map((favorite, index) => {
          return <FavoriteItem favorite={favorite} deleteFavorite={deleteFavorite} index={index} key={index}/>
        })}
        </div>
        : <div className={styles.favorites}><h2>Você não possui nenhum favorito!</h2></div>
      }
      <Footer />
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