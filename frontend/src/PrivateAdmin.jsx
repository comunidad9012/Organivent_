import { Navigate, Route } from "react-router-dom"
import { PrivateRoutes } from "./models/routes"
import RoutesWhitNotFound from "./utilities/routesWhitNotFound.utility"
import { lazy } from "react"

import FormProducto from "./components/FormProducto";
import AdminPedidos from "./components/AdminPedidos";

const Admin = lazy(() => import('./pages/Admin'));

function PrivateAdmin() {
  return (
      <RoutesWhitNotFound>
          <Route path="/" element={<Navigate to={PrivateRoutes.ADMIN}/>}  /> 

          <Route path={PrivateRoutes.ADMIN} element={<Admin />} />
          <Route path={PrivateRoutes.CREATE_PRODUCT} element={<FormProducto />} /> 
          <Route path={`${PrivateRoutes.EDIT_PRODUCT}/:id`} element={<FormProducto />} />
          <Route path={PrivateRoutes.ADMIN_PEDIDOS} element={<AdminPedidos />} />

      </RoutesWhitNotFound>
  )
}
export default PrivateAdmin