import { Carousel } from 'react-responsive-carousel';

interface BannerProps {
  source: string[];
}

const Banner: React.FC<BannerProps> = (props) => {

  return (
    <Carousel autoPlay={true} infiniteLoop={true}>

      {props.source.map((source, index) => {
        return <div key={index}><img src={`${source}`} key={index} /></div>
      })}

    </Carousel>
  );
};

export default Banner;