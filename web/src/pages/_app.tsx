import '../styles/global.css';
import * as dotenv from 'dotenv';

function MyApp({ Component, pageProps }) {
  // dotenv.config();
  return <Component {...pageProps} />
}

export default MyApp