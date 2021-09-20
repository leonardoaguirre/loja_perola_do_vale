import '../styles/global.css';
import '../custom.scss';

import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </CartProvider>
  )
}

export default MyApp;