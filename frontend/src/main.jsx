import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
<>
    {/* BrowserRouter → enables page routing */}
    <BrowserRouter>
      {/* AuthProvider → user login state available everywhere */}
      <AuthProvider>
        {/* CartProvider → cart state available everywhere */}
        <CartProvider>
          <App />
          {/* Toaster → shows success/error notifications */}
         <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '14px',
      background: '#000',
      color: '#fff',
      borderRadius: '999px',
      padding: '12px 20px',
    },
  }}
/>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </>
 
)