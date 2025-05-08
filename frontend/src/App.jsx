// Componente principal de React, define la estructura base de tu aplicación.

import { BrowserRouter, Route, Navigate} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import ProductosDetail from './components/ProductosDetail';
import { PrivateRoutes, PublicRoutes } from "./models/routes";
import AuthGuard from "./guards/auth.guard";
import RoutesWhitNotFound from "./utilities/routesWhitNotFound.utility";
import { Suspense, lazy } from "react";
import { FiltersProvider } from "./components/context/filters";
import { CartProvider } from "./components/context/CartContext";
import Loading from "./utilities/Loading";

const Login = lazy(() => import('./components/Login')); 
const Private = lazy(() => import('./Private/Private'));
//esto de lazy es para que cargue el componente solo cuando se necesite, no al principio, recien cuando llame a Private lo va a cargar.

function App() {  

  return (
    <div className="App" style={{ margin: "120px"}}>
      <Suspense fallback={<Loading/>}> 
        <Provider store={store}>
          <BrowserRouter>
            {/*aca es donde consumimos el contexto de useContext*/}
            <FiltersProvider> 
              <CartProvider>
                <Navbar />
                {/* en vez de poner Routes directamente ponemos RoutesWhitNotFound ya que dentro del mismo tenemos a Routes*/}
                <RoutesWhitNotFound>
                  {/* ver como reordenar para que el cliente pueda ver los productos sin loguearse */}
                  <Route path='/' element={<Navigate to={PrivateRoutes.PRIVATE} />} /> 

                  <Route path={PublicRoutes.LOGIN} element={<Login/>} />

                  <Route path={PublicRoutes.VIEW_PRODUCT} element={<ProductosDetail />} />

                  <Route element={<AuthGuard />}>
                    <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private />} />
                  </Route>

                </RoutesWhitNotFound>
              </CartProvider>
            </FiltersProvider>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>
   
  );
}


export default App;

