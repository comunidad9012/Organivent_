import { Navigate, Route } from "react-router-dom"
import { PrivateRoutes, PublicRoutes } from "../models/routes"
import RoutesWhitNotFound from "../utilities/routesWhitNotFound.utility"
import { lazy } from "react"
import RoleGuard from "../guards/rol.guard";
import Cart from "../components/Cart";
import ProductosDetail from "../components/ProductosDetail";
import PrivateAdmin from "./PrivateAdmin";
import ListaPedidos from "../components/ListaPedidos";
import DetallePedido from "../components/DetallePedido";
import Favoritos from "../components/Favoritos";

const User = lazy(() => import('../pages/User'));

function PrivateUser() {
  return (
      <RoutesWhitNotFound>
        <Route path="/" element={<Navigate to={PrivateRoutes.ADMIN}/>}  /> 
        
        <Route path={PrivateRoutes.USER} element={<User />} />
        <Route path={PrivateRoutes.USER_PEDIDOS} element={<ListaPedidos />} />
        <Route path={PrivateRoutes.USER_VIEW_PEDIDO} element={<DetallePedido/>} />
        <Route path={PrivateRoutes.CART} element={<Cart />}/>
        <Route path={PrivateRoutes.USER} element={<User />} />
        <Route path={`user/${PrivateRoutes.FAVORITES}`} element={<Favoritos />} />
        
          {/* aca puedo poner el roleGuard para el admin y arriba para el del usuario y los path a los que deriva si los saca corriendo */}
        <Route element={<RoleGuard />}>
          <Route path={`${PrivateRoutes.ADMIN}/*`} element={<PrivateAdmin />} />
        </Route>
      </RoutesWhitNotFound>
  )
}
export default PrivateUser