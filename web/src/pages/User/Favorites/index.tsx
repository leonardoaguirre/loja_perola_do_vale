import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import styles from './styles.module.css';
import FavoriteItem from "../../../components/FavoriteItem";
import { Favorite } from '../../../models/Favorite';
import { GetServerSideProps, GetStaticProps } from "next";
import api from "../../../services/api";
import { useState } from 'react';

interface FavoritesProps {
  favorites: Favorite[];
}

const Favorites: React.FC<FavoritesProps> = (props) => {

  const [nfavorites, setNfavorites] = useState<number>(props.favorites.length);

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
    <>
      <Header />
      {nfavorites > 0 ?
        <div id="favorite" className={styles.favorites}>
        {props.favorites.map((favorite, index) => {
          return <FavoriteItem favorite={favorite} deleteFavorite={deleteFavorite} index={index} key={index}/>
        })}
        </div>
        : <h2>Você não possui nenhum favorito!</h2>
      }
      <Footer />
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = context.req.cookies;
	const userData = JSON.parse(user);

  // let data = [];

  // api.get(`favorito/ListarPorPessoa/${userData.id}`).then(
  //   (res) => {
  //     if (res.status === 200){
  //       data = res.data;
  //     }
  //     console.log(res.status);
  //   }
  // ).catch(
  //   (error) => {
  //     console.log(error.status)
  //     data = [];
  //   }
  // )

  const response = await fetch(`http://localhost:3008/favorito/ListarPorPessoa/${userData.idPessoa}`);
	const data = await response.json();


  return {
    props: {
      favorites: data
    }
  }
}


export default Favorites;