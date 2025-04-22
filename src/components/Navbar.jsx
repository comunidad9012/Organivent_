import { Link, useLocation } from "react-router-dom";
//import EditarProducto from "./EditarProducto";
import Categorias from './Categorias';
import SearchForm from './SearchForm';
import '../styles/navbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";
import Logout from "./Logout";
import { PrivateRoutes } from "../models/routes";

function Navbar() {
    const location = useLocation(); // Obtener la ubicación actual
    const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no
    
    return (
        <nav className="bg-gray-100 px-4 py-3 fixed top-0 left-0 w-full shadow-lg h-20 z-50">
            <div className="flex justify-around items-center mx-auto">
                
                {/* Logo */}
                {/* DEJAR EL INICIO EN CUALQUIER PARTE PORQUE SE SUPONE QUE EL USUARIO PUEDE VER LOS PRODUCTOS SIN NECESIDAD DE LOGUEARSE */}
                {location.pathname !== '/' && (
                <Link to="/" className="flex items-center gap-2 font-bold text-lg relative fancy">
                    <span className="top-key"></span>
                    <span className="text">Inicio</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </Link>
                )}

                {/* Menú */}
                <div className="flex items-center gap-4">
                    {userState.rol === null && (
                        <Link to="/createClient" className="fancy">
                        <span className="top-key"></span>
                        <span className="text">Crear cuenta</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                        </Link>
                    )}

                    {userState.rol === Roles.ADMIN && (
                        <Link to="/holiiiiss" className="fancy">
                        <span className="top-key"></span>
                        <span className="text">Cositas de admin</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                        </Link>
                    )}

                    {userState.rol === Roles.ADMIN && location.pathname !== `/private/${PrivateRoutes.CREATE_PRODUCT}` && (
                        <Link to={`/private/${PrivateRoutes.CREATE_PRODUCT}`} className="fancy">
                        <span className="top-key"></span>
                        <span className="text">Añadir producto</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                        </Link>
                    )}
                </div>

                {/* Acciones del usuario */}
                {userState.rol !== null && (
                <div className="flex items-center gap-4">
                    <Categorias />
                    <SearchForm />
                    {/* <p className="text-lg text-black mx-4">¡Hola {userState.nombre_usuario}!</p> */}
                    <p className="text-lg text-black mx-4 whitespace-nowrap">¡Hola {userState.nombre_usuario}!</p>


                    {userState.rol === Roles.USER && location.pathname !== `/private/${PrivateRoutes.CART}` && (
                    <Link to={`/private/${PrivateRoutes.CART}`}>
                        <button className="flex p-2 hover:bg-blue-300 rounded">
                        {/* Icono carrito */}
                        <svg
                            color="white"
                            className="icon"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="1.5em"
                            width="3em"
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        </button>
                    </Link>
                    )}

                    <Logout />
                </div>
                )}
            </div>
        </nav>

    );
}


export default Navbar;
