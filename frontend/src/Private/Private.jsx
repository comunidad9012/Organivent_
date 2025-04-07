import { Navigate, Route } from "react-router-dom"
import { PrivateRoutes } from "../models/routes"
import RoutesWhitNotFound from "../utilities/routesWhitNotFound.utility"
import { lazy } from "react"
import RoleGuard from "../guards/rol.guard";

const HomeUser = lazy(() => import('./HomeUser'));
const Admin = lazy(() => import('./Admin'));

function Private() {
  return (
    <RoutesWhitNotFound>
        {/* tengo que solucionar esto porque esta mal planteado*/}
      <Route path="/" element={<Navigate to={PrivateRoutes.ADMIN}/>}  /> 

      {/* creo que por aca rodeando lo que es del usuario pondria el contexto del carrito */}
      <Route path={PrivateRoutes.USER} element={<HomeUser />} />

      <Route element={<RoleGuard />}>
        <Route path={`${PrivateRoutes.ADMIN}/*`} element={<Admin />} />
      </Route>

          {/* ver si es asi la ruta */}
      
      {/* esto es para tener acceso a todas las rutas que una vez que te logueate puede entrar */}
      {/* <Route path={PrivateRoutes.SETTINGS} element={<Settings />} />  esto es a la bartola*/}
    </RoutesWhitNotFound>
  )
}
export default Private