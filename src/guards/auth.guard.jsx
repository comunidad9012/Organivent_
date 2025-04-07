import { useSelector } from "react-redux"
import store from "../redux/store"
import { Navigate, Outlet } from "react-router-dom"
import { PublicRoutes } from "../models/routes"

export const AuthGuard = () => {
    const userState = useSelector(store => store.user)
    return userState.nombre_usuario ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />
}

export default AuthGuard;