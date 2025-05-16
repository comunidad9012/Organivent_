import { Navigate, Route } from "react-router-dom"
import { PrivateRoutes } from "./models/routes"
import RoutesWhitNotFound from "./utilities/routesWhitNotFound.utility"
import { lazy } from "react"
import RoleGuard from "./guards/rol.guard";
import Cart from "./components/Cart";
import FormProducto from "./components/FormProducto";
import AdminPedidos from "./components/AdminPedidos";

const User = lazy(() => import('./pages/User'));
const Admin = lazy(() => import('./pages/Admin'));

function Private() {
  return (
      <RoutesWhitNotFound>
          {/* me conviene que intente entrar al admin de una? digo porque sino el admin entra a estas ruta tambien y habria inconsistencia */}
        <Route path="/" element={<Navigate to={PrivateRoutes.ADMIN}/>}  /> 

        
        <Route path={PrivateRoutes.USER} element={<User />} />
        <Route path={PrivateRoutes.CART} element={<Cart />}/>
        

        <Route element={<RoleGuard />}>
        {/* ACA PODRIA HACER OTRO PRIVATE DE ADMIN Y CON ESO LOGRARIA ANIDAR admin/FormProducto */}
          <Route path={`${PrivateRoutes.ADMIN}/*`} element={<Admin />} />
          <Route path={PrivateRoutes.CREATE_PRODUCT} element={<FormProducto />} /> 
          <Route path={`${PrivateRoutes.EDIT_PRODUCT}/:id`} element={<FormProducto />} />
          <Route path={PrivateRoutes.ADMIN_PEDIDOS} element={<AdminPedidos />} />

        </Route>
      </RoutesWhitNotFound>
  )
}
export default Private