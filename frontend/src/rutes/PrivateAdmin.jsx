import { Route } from "react-router-dom"
import { PrivateRoutes } from "../models/routes"
import RoutesWhitNotFound from "../utilities/routesWhitNotFound.utility"
import { lazy } from "react"

import ListaPedidos from "../components/ListaPedidos";
import ProductoDetail from "../components/ProductosDetail";
import FormProductoModern from "../components/FormProducto";
import DetallePedido from "../components/DetallePedido";
import FormDescuento from "../components/FormDescuento";
import ListDiscount from "../components/ListDiscount";

const Admin = lazy(() => import('../pages/Admin'));

function PrivateAdmin() {
  return (
      <RoutesWhitNotFound>
          <Route path="/" element={<Admin />}  />  

          <Route path={PrivateRoutes.CREATE_PRODUCT} element={<FormProductoModern />} /> 

          <Route path={PrivateRoutes.UPDATE_PRODUCT} element={<FormProductoModern />} />

          <Route path={PrivateRoutes.ADMIN_PEDIDOS} element={<ListaPedidos />} />
          <Route path={PrivateRoutes.DESCUENTOS} element={<ListDiscount />} />
          <Route path={PrivateRoutes.CREATE_DESCUENTO} element={<FormDescuento />} />
          {/* arregla para que sea como con productos */}
          <Route path={`${PrivateRoutes.UPDATE_DESCUENTO}`} element={<FormDescuento isEdit={true} />} />


          <Route path={PrivateRoutes.ADMIN_VIEW_PEDIDO} element={<DetallePedido />} />

          <Route path={PrivateRoutes.VIEW_PRODUCT_PRIVATE} element={<ProductoDetail />} />


      </RoutesWhitNotFound>
  )
}
export default PrivateAdmin