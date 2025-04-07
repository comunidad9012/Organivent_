//Punto de entrada de la aplicación. Renderiza App.js en el DOM.
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
    <CartProvider>
      <App />
    </CartProvider>
    //tengo que poner el CartProvider donde vaya (creo que es en Private en donde esta el user) y poner la ruta para que direccione al componente 
)

