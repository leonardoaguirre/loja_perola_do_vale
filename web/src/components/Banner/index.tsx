import { Carousel } from "react-bootstrap";

import styles from './styles.module.css'

interface BannerProps {
  source: string[];
}

const Banner: React.FC<BannerProps> = (props) => {

  return (
    <Carousel className={styles.banner}>
      {props.source.map((source, index) => {
        return (
          <Carousel.Item className={styles.item} key={index}>
            <img
              src={source}
            />
          </Carousel.Item>
        )
      })}
    </Carousel>
  );
};

export default Banner;