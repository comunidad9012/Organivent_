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
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import ProfileDropdown from "./ProfileDropdown";

import { ShoppingCart } from 'lucide-react';

import { useCart } from "./context/CartContext";
import { useState, useEffect } from "react";

function Navbar() {
    const location = useLocation(); // Obtener la ubicación actual
    const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no
    const { cart } = useCart();

    const [animate, setAnimate] = useState(false);
    // Cada vez que cambie la cantidad total, activamos la animación
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    useEffect(() => {
        if (totalItems > 0) {
          setAnimate(true);
          const timeout = setTimeout(() => setAnimate(false), 600); // duración de animación
          return () => clearTimeout(timeout);
        }
      }, [totalItems]);


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
                        <button className="relative flex p-2 hover:bg-gray-200 rounded">
                        {/* Icono carrito */}
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
          <span
            className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 transition-transform ${
              animate ? "animate-bounce" : ""
            }`}
          >
            {totalItems}
          </span>
        )}
                        </div>
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
