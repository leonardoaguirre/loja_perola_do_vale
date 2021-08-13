import Link from 'next/link';

import styles from './styles.module.css'

interface LogoProps {
  imgheight?: string;
  titleheight?: string;
  color?: 'white' | 'black';
}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <div className={styles.logoContainter}>
      <Link href="/">
        <a>
          <img 
            id={styles.logoImg} 
            style={{ height: props.imgheight }} 
            src="/icons/logo.png" 
            alt="Logo Ferragens Pérola do Vale" 
            title="Logo Ferragens Pérola do Vale" 
          />
          {!props.color ?
            <img 
              id={styles.logoTitle} 
              style={{ height: props.titleheight }} 
              src="/icons/ferragens-perola-do-vale-preto.png" 
              alt="Logo título Ferragens Pérola do Vale" 
              title="Logo título Ferragens Pérola do Vale" 
            />
          : props.color === 'black' ?
          <img 
            id={styles.logoTitle} 
            style={{ height: props.titleheight }} 
            src="/icons/ferragens-perola-do-vale-preto.png" 
            alt="Logo título Ferragens Pérola do Vale" 
            title="Logo título Ferragens Pérola do Vale" 
          />
          : props.color === 'white' ?
          <img 
            id={styles.logoTitle} 
            style={{ height: props.titleheight }} 
            src="/icons/ferragens-perola-do-vale-branco.png" 
            alt="Logo título Ferragens Pérola do Vale" 
            title="Logo título Ferragens Pérola do Vale" 
          />
          : <img 
              id={styles.logoTitle} 
              style={{ height: props.titleheight }} 
              src="/icons/ferragens-perola-do-vale-preto.png" 
              alt="Logo título Ferragens Pérola do Vale" 
              title="Logo título Ferragens Pérola do Vale" 
            />
          }
        </a>
      </Link>
    </div>
  );
}

export default Logo;