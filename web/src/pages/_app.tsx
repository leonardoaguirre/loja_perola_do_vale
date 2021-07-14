import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as dotenv from 'dotenv';

import { UserProvider } from '../contexts/UserContext';

function MyApp({ Component, pageProps }) {
  // dotenv.config();
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp