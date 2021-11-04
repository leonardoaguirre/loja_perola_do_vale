import '../styles/global.css';
import '../custom.scss';

import SSRProvider from 'react-bootstrap/SSRProvider';

import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';
import { StepperProvider } from '../contexts/StepperContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <UserProvider>
        <StepperProvider>
          <SSRProvider>
            <Component {...pageProps} />
          </SSRProvider>
        </StepperProvider>
      </UserProvider>
    </CartProvider>
  )
}

export default MyApp;