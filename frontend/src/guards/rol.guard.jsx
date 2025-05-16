//este guard es para controlar el acceso segun los roles, el rol lo saca de redux (proviene del token validado por el backend)

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PrivateRoutes } from "../models/routes"
import store from "../redux/store"
import { Roles } from '../models/roles';

function RoleGuard() {
    const userState = useSelector((store) => store.user);
    return userState.rol === Roles.ADMIN ? <Outlet /> : <Navigate replace to={PrivateRoutes.USER} />;
  }
  export default RoleGuard;

  //quizas aca puedo pasarle por props el rol y el path al que quiero redirigir