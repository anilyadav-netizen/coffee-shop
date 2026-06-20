import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CartProvider>
      <WishlistProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </WishlistProvider>
    </CartProvider>
  </Provider>
)
