import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './routes.tsx'
import App from './App'
import { AuthProvider, CategoryProvider, ProductProvider } from './context/AuthContext'
import { MessageProvider } from './context/MessageContext'
import { OrderProvider } from './context/OrderContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CategoryProvider>
      <AuthProvider>
        <ProductProvider>
          <MessageProvider>
            <OrderProvider>
              <AppRouter />
              <App />
            </OrderProvider>
          </MessageProvider>
        </ProductProvider>
      </AuthProvider>
    </CategoryProvider>
  </StrictMode>
)
