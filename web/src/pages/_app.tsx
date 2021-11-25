import '../custom.scss';
import '../styles/global.css';

import SSRProvider from 'react-bootstrap/SSRProvider';

import { CartProvider } from '../contexts/CartContext';
import { StepperProvider } from '../contexts/StepperContext';
import { ToastProvider } from '../contexts/ToastContext';
import { UserProvider } from '../contexts/UserContext';

function MyApp({ Component, pageProps }) {
  return (

    <ToastProvider>
      <CartProvider>
        <UserProvider>
          <StepperProvider>
            <SSRProvider>
              <Component {...pageProps} />
            </SSRProvider>
          </StepperProvider>
        </UserProvider>
      </CartProvider>
    </ToastProvider>
  )
}

export default MyApp;