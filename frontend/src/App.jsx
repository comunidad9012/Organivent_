// Componente principal de React, define la estructura base de tu aplicación.

import { BrowserRouter, Route, Navigate} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Navbar from "./components/Navbar";
import ProductosDetail from './components/ProductosDetail';
import FormProducto from './components/FormProducto';
import CreateClient from './components/CreateClient';
import { PrivateRoutes, PublicRoutes } from "./models/routes";
import AuthGuard from "./guards/auth.guard";
import RoutesWhitNotFound from "./utilities/routesWhitNotFound.utility";
import { Suspense, lazy } from "react";
import { FiltersProvider } from "./components/context/filters";
import Logout from "./components/Logout";
import Cart from "./components/Cart";

const Login = lazy(() => import('./components/Login')); //ver si esto de Login/Login esta bien
const Private = lazy(() => import('./Private/Private')); //ver si esto de private/Private esta bien minuscula mayuscula
//esto de lazy es para que cargue el componente solo cuando se necesite, no al principio, recien cuando llame a Private lo va a cargar.

function App() {  

  return (
    <div className="App">
      <Suspense fallback={<>Cargando...Hay que poner spinner</>}> 
        <Provider store={store}>
          <BrowserRouter>
            {/*aca es donde consumimos el contexto de useContext*/}
            <FiltersProvider> 
              <Navbar />
              {/* en vez de poner Routes directamente ponemos RoutesWhitNotFound ya que dentro del mismo tenemos a Routes*/}
              <RoutesWhitNotFound> 
                {/* se me ocurre hacer otro componente que sea como inicio y en ese poner el de Productos */}
                <Route path='/' element={<Navigate to={PrivateRoutes.PRIVATE} />} /> 

                <Route path={PublicRoutes.LOGIN} element={<Login/>} />

                <Route element={<AuthGuard />}>
                  <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private />} />
                </Route>

                {/* entonces parece que estas rutas las tengo que ir poniendo dentro de los otros componentes segun si son privados o publicos, lo mismo que ordenar los componentes segun la carpeta a donde deben ir (creo que asi quedaria mas ordenado)*/}
                <Route path='/Productos/viewproduct/:id' element={<ProductosDetail />} />
                <Route path='/Productos/editor' element={<FormProducto />} /> 
                <Route path='/Productos/edit/:id' element={<FormProducto />} /> 
                <Route path='/createClient' element={<CreateClient />} />




                <Route path="/cart" element={<Cart />}/>





              </RoutesWhitNotFound>
            </FiltersProvider>
          <Logout /> 
          {/* el logout deberia de estar en el navbar en el condicional de cuando hay alguien logueado */}
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>
   
  );
}


export default App;

