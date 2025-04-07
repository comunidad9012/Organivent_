import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PrivateRoutes } from "../models/routes"
import store from "../redux/store"
import { Roles } from '../models/roles';

function RoleGuard() {
    const userState = useSelector((store) => store.user);
    return userState.rol === Roles.ADMIN ? <Outlet /> : <Navigate replace to={PrivateRoutes.USER} />; //ver si queda bien poner .USER
  }
  export default RoleGuard;


  //esto esta a la que te criaste porque el rol esta pasado como props y metido a la fuerza en el componente en vez de salvarlo desde redux