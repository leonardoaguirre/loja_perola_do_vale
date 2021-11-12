import { useState } from 'react';
import { GetServerSideProps } from "next";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FavoriteItem from "../../../components/FavoriteItem";

import { Favorite } from '../../../models/Favorite';

import styles from './styles.module.css';
import api from "../../../services/api";
import { environment } from '../../../environments/environment';

interface FavoritesProps {
  favorites: Favorite[];
}

const Favorites: React.FC<FavoritesProps> = (props) => {

  const [nfavorites, setNfavorites] = useState<number>(props.favorites?.length);

  const deleteFavorite = (idFavorito: number, index: number) => {
    console.log("deleteFavorite", document.getElementById(`item${index}`));
    api.delete(`${environment.API}/favorito/deletarPorId`, {
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
    <div className="pageContainer">
      <Header />
      <div id="favorite" className="pageContent fx-column">
      {nfavorites > 0 ?
        <>
          {props.favorites.map((favorite, index) => {
            return <FavoriteItem favorite={favorite} deleteFavorite={deleteFavorite} index={index} key={index}/>
          })}
        </>
        : <h2>Você não possui nenhum favorito!</h2>
      }
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