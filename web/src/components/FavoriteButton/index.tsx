import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { UserContext } from '../../contexts/UserContext';
import { environment } from '../../environments/environment';
import api from '../../services/api';
import styles from './styles.module.css';

interface FavoriteButtonProps {
  productId: string;
}

interface Favorite {
  idFavorito: number;
  favoritado: boolean;
  nFavoritos: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId
}) => {

  const { user } = useContext(UserContext);

  const [favorite, setFavorite] = useState<Favorite>({ idFavorito: null, favoritado: false, nFavoritos: 0 });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const user = Cookies.getJSON("user");
    let idPessoa = '';
    if (user) {
      idPessoa = user.idPessoa;
      setIsDisabled(false);
    }
    // buscar dados de favorito
    api.get(`favorito/verificaFavorito/${productId}?idPessoa=${user ? idPessoa : ''}`).then((res) => {
      setFavorite(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

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
      }).catch((error) => {
        console.log(error);
      });

    } else {
      // favoritar

      api.post(`${environment.API}/favorito/adicionar`, {
        idPessoa: user.idPessoa,
        idProduto: productId
      }).then((res) => {
        setFavorite({
          idFavorito: res.data.idFavorito,
          favoritado: true,
          nFavoritos: favorite.nFavoritos + 1
        })
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  return (
    <div className={styles.favoriteButton}>
      <Button id="btnfav" variant="outline-primary" onClick={handleFavorite} disabled={isDisabled}>
        {(favorite.favoritado) ? (
          <AiFillHeart color="red" />
        ) : (
          <AiOutlineHeart />
        )}
        <div className={styles.favCont}>
          {favorite.nFavoritos}
        </div>
      </Button>
    </div>
  )
}

export default FavoriteButton;