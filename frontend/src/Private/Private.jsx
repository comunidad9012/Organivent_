import { Navigate, Route } from "react-router-dom"
import { PrivateRoutes } from "../models/routes"
import RoutesWhitNotFound from "../utilities/routesWhitNotFound.utility"
import { lazy } from "react"
import RoleGuard from "../guards/rol.guard";
import Cart from "../components/Cart";
import FormProducto from "../components/FormProducto";

const HomeUser = lazy(() => import('./HomeUser'));
const Admin = lazy(() => import('./Admin'));

function Private() {
  return (
      <RoutesWhitNotFound>
          {/* tengo que solucionar esto porque esta mal planteado*/}
        <Route path="/" element={<Navigate to={PrivateRoutes.ADMIN}/>}  /> 

        
        <Route path={PrivateRoutes.USER} element={<HomeUser />} />
        <Route path={PrivateRoutes.CART} element={<Cart />}/>
        

        <Route element={<RoleGuard />}>
          <Route path={`${PrivateRoutes.ADMIN}/*`} element={<Admin />} />
          <Route path={PrivateRoutes.CREATE_PRODUCT} element={<FormProducto />} /> 
          <Route path={`${PrivateRoutes.EDIT_PRODUCT}/:id`} element={<FormProducto />} />

        </Route>

            {/* ver si es asi la ruta */}
        
        {/* esto es para tener acceso a todas las rutas que una vez que te logueate puede entrar */}
        {/* <Route path={PrivateRoutes.SETTINGS} element={<Settings />} />  esto es a la bartola*/}
      </RoutesWhitNotFound>
  )
}
export default Private