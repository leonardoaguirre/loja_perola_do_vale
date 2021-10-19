import '../styles/global.css';
import '../custom.scss';

import SSRProvider from 'react-bootstrap/SSRProvider';

import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <UserProvider>
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </UserProvider>
    </CartProvider>
  )
}

export default MyApp;