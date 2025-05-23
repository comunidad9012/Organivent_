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
                    <SearchForm />
                    <p className="text-lg  text-black mx-4 whitespace-nowrap">¡Hola {userState.nombre_usuario}!</p>

                {/* Acciones del usuario */}
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

                    <Logout />

                    {/* Profile dropdown VER*/}
                    {/* <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            className="size-8 rounded-full"
                        />
                        </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                            Your Profile
                        </a>
                        </MenuItem>
                        <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                            Settings
                        </a>
                        </MenuItem>
                        <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                            Sign out
                        </a>
                        </MenuItem>
                    </MenuItems>
                    </Menu> */}


                </div>
             )} 
            </div>
        </nav>

    );
}


export default Navbar;
