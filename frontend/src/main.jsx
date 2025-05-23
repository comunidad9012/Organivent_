//Punto de entrada de la aplicación. Renderiza App.js en el DOM.
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(  
  <App />
)

