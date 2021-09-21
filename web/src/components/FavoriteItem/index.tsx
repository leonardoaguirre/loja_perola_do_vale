import styles from './styles.module.css';
import { Product } from '../../models/Product';
import { Favorite } from '../../models/Favorite';
import { capitalize } from '@material-ui/core';
import { useState } from 'react';
import { remove } from 'js-cookie';

interface FavoriteItemProps {
  favorite: Favorite;
  deleteFavorite(idFavorito: number, event): void;
  index: number;
}

const FavoriteItem: React.FC<FavoriteItemProps> = (props) => {

  const [hasDiscount, setHasDiscount] = useState<boolean>(false);

  return (
    <div id={`item${props.index}`} className={styles.favoriteItem}>
      <div className={styles.main}>
        <div className={styles.image}>
          <img src={`http://localhost:3008/${props.favorite.produto.imagens[0].path}`} alt={capitalize(props.favorite.produto.nome)} title={capitalize(props.favorite.produto.nome)} loading="lazy" />
        </div>
        <div className={styles.mainContent}>
          <h2>{props.favorite.produto.nome}</h2>
          <div className={styles.price}>
            <div className={styles.values}>
              <div className={styles.currentPrice}>
                <strong>R$</strong>
                <strong>{parseFloat(props.favorite.produto.valorVenda.toString()).toFixed(2).replace('.', ',')}</strong>
                <span>/ item</span>
              </div>
              {hasDiscount ?
                <div className={styles.oldPrice}>
                  <span>R$ </span>
                  <span>{(props.favorite.produto.valorVenda * 1.1).toFixed(2).replace('.', ',')}</span>
                  <span> / item</span>
                </div>
                : ''
              }
            </div>
            {hasDiscount ?
              <div className={styles.time}>
                <span>2 dias restantes</span>
              </div>
              : ''
            }
          </div>
        </div>
      </div>
      <div className={styles.aside}>
        <p>Adicionado em <span>
          {new Date(props.favorite.created_at).toLocaleDateString("pt-br", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span></p>
        <div><a onClick={() => props.deleteFavorite(props.favorite.id, props.index)}>Remover</a></div>
        <div><a>Encontre produtos similares</a></div>
      </div>
    </div>
  );
}



export default FavoriteItem;