import { Route } from "react-router-dom"
import { PrivateRoutes } from "./models/routes"
import RoutesWhitNotFound from "./utilities/routesWhitNotFound.utility"
import { lazy } from "react"

import AdminPedidos from "./components/AdminPedidos";
import ProductoDetail from "./components/ProductosDetail";
import FormProductoModern from "./components/FormProducto";

const Admin = lazy(() => import('./pages/Admin'));

function PrivateAdmin() {
  return (
      <RoutesWhitNotFound>
          <Route path="/" element={<Admin />}  />  

          <Route path={PrivateRoutes.CREATE_PRODUCT} element={<FormProductoModern />} /> 

          <Route path={PrivateRoutes.UPDATE_PRODUCT} element={<FormProductoModern />} />

          {/* aca se reordenaron las rutas para que funcionen*/}

          <Route path={PrivateRoutes.ADMIN_PEDIDOS} element={<AdminPedidos />} />
          <Route path={PrivateRoutes.VIEW_PRODUCT_PRIVATE} element={<ProductoDetail />} />


      </RoutesWhitNotFound>
  )
}
export default PrivateAdmin