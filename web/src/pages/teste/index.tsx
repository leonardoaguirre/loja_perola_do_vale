import { Carousel } from "react-bootstrap";

interface BannerProps {
  source: string[];
}

const Teste: React.FC<BannerProps> = (props) => {

  const images = ['https://i.pinimg.com/originals/91/9c/57/919c5719579d855d1fa9e1c128a80d64.jpg',
                  'https://wallpaperaccess.com/full/5648058.jpg',
                  'https://wallpapercave.com/wp/wp4470749.jpg'];

  return (
    <div>
      <Carousel>
        {images.map((source, index) => {
          return (
            <Carousel.Item key={index}>
              <img
                src={source}
              />
            </Carousel.Item>
          )
        })}
      </Carousel>
    </div>
  );
}

export default Teste;