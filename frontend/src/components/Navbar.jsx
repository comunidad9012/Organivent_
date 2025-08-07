import { Link, useLocation } from "react-router-dom";
//import EditarProducto from "./EditarProducto";
import Categorias from './Categorias';
import SearchForm from './SearchForm';
import '../styles/navbar.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// SACAR ESTO CUANDO MIGRE LAS COSAS A TAILWIND
import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";
import Logout from "./Logout";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
    const location = useLocation(); // Obtener la ubicación actual
    const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

    const isInPrivate = location.pathname.startsWith(`/${PrivateRoutes.PRIVATE}`);
    
    return (
        <nav className="bg-gray-100 px-4 fixed top-0 left-0 w-full shadow-lg h-20 z-50">
            <div className="flex justify-around items-center mx-auto h-full">

                {location.pathname !== `/${PublicRoutes.HOME}` && !isInPrivate && (
                <Link to={`/${PublicRoutes.HOME}` } className="flex items-center gap-2 font-bold text-lg relative fancy">
                    <span className="top-key"></span>
                    <span className="text">Inicio</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </Link>
                )}

                {isInPrivate && (
                    <Link to={`/${PrivateRoutes.PRIVATE}`} className="flex items-center gap-2 font-bold text-lg relative fancy">
                        <span className="top-key"></span>
                        <span className="text">Inicio</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                    </Link>
                )}

            {/* Menú */}
                {/* usuario no autenticado */}
                {userState.rol === null && location.pathname !== `/${PublicRoutes.LOGIN}` && (
                    <Link to={`/${PublicRoutes.LOGIN}`} className="fancy">
                    <span className="top-key"></span>
                    <span className="text">Iniciar sesión</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                    </Link>
                )}

                {/* Acciones del administrador */}
                <div className="flex items-center gap-4">
                    {userState.rol === Roles.ADMIN && location.pathname !== `/private/admin/${PrivateRoutes.ADMIN_PEDIDOS}` && (
                        <Link to={`/private/admin/${PrivateRoutes.ADMIN_PEDIDOS}`} className="fancy">
                        <span className="top-key"></span>
                        <span className="text">Pedidos</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                        </Link>
                    )}

                    {userState.rol === Roles.ADMIN && location.pathname !== `/private/admin/${PrivateRoutes.CREATE_PRODUCT}` && (
                        <Link to={`/private/admin/${PrivateRoutes.CREATE_PRODUCT}`} className="fancy">
                        <span className="top-key"></span>
                        <span className="text">Añadir producto</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                        </Link>
                    )}
                </div>

                {/* por defecto de cualquiera que esté logueado */}
                {userState.rol !== null && (
                <div className="flex items-center gap-4">
                    <Categorias />
                    {/* <SearchForm /> */}
                    
                    {/* aca solo saqué el serch*/}
                    <ProfileDropdown/>

                {/* Acciones del usuario */}
                    {userState.rol === Roles.USER && location.pathname !== `/private/${PrivateRoutes.USER_PEDIDOS}` && (
                        <Link to={`/private/${PrivateRoutes.USER_PEDIDOS}`} className="!text-gray-500 hover:!text-gray-700 visited:!text-gray-500">
                       Mis pedidos
                        </Link>
                    )}

                    {userState.rol === Roles.USER && location.pathname !== `/private/${PrivateRoutes.CART}` && (
                    <Link to={`/private/${PrivateRoutes.CART}`}>
                        <button className="flex p-2 hover:bg-gray-200 rounded">
                        {/* Icono carrito */}
                        <svg
                            color="black"
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


                </div>
             )} 
            </div>
        </nav>

    );
}


export default Navbar;
