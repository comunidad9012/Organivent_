//el acceso a rutas privadas esta controlado por este guard que se fija si el token aún es válido o no, si no lo es redirige al login

import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useDispatch } from "react-redux";
import { createUser } from "../redux/userSlice";
import { PublicRoutes } from "../models/routes"
import Loading from "../utilities/Loading";

export const AuthGuard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("auth guard montado!") 
        fetch("http://localhost:5000/auth/verificar_jwt", {
            method: "GET",
            credentials: "include", // Esto envía las cookies httpOnly
        })
        .then(response => {
            if (response.ok) {
                return response.json() // Esto devuelve una promesa con los datos del usuario
            } else {
                console.log("no hay token")
                throw new Error("Token inválido")
            }
        })
        .then(data => {
            console.log("Datos recibidos del backend: ", data);
            dispatch(createUser(data)) 
            setIsAuthenticated(true)
        })
        .catch(() => {
            setIsAuthenticated(false)
        })
    }, [])
    

    if (isAuthenticated === null) return <div><Loading/></div> //poner Loading
    return isAuthenticated ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />
}

export default AuthGuard