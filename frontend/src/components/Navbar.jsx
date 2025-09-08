import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ShoppingCart, Search, Heart, User } from 'lucide-react';

import Categorias from './Categorias';
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "./context/CartContext";
import store from "../redux/store";
import { Roles } from "../models/roles";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import '../styles/navbar.css';
import { Sparkles } from "lucide-react"; // iconito de brillito
import FavoritesButton from "./FavoritesButton";

// Componente para el logo
const Logo = () => (
  <Link to={`/${PublicRoutes.HOME}`} className="flex items-center gap-2 group">
    {/* Círculo con brillo */}
    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
      <Sparkles className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors duration-300" />
    </div>

    {/* Texto con efecto de brillito */}
    <span className="text-2xl font-extrabold text-gray-800 group-hover:text-yellow-500 transition-colors duration-300">
      Un destello más
    </span>
  </Link>
);

// Componente para la barra de búsqueda
const SearchBar = () => (
  <div className="relative flex-1 max-w-md mx-4">
    <input
      type="text"
      placeholder="Buscar productos..."
      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  </div>
);

// Componente para enlaces de navegación
const NavLink = ({ to, children, icon: Icon, isActive = false }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span className="font-medium">{children}</span>
  </Link>
);

// Componente para el botón del carrito
const CartButton = ({ totalItems, animate }) => (
  <Link to={`/private/${PrivateRoutes.CART}`}>
    <button 
      className="relative flex p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      aria-label={`Carrito de compras - ${totalItems} items`}
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-600" />
        {totalItems > 0 && (
          <span
            className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center transition-transform ${
              animate ? "animate-bounce" : ""
            }`}
          >
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
    </button>
  </Link>
);

// Componente para acciones del usuario autenticado
const UserActions = ({ userRole, location, totalItems, animate, userState }) => {
  return (
    <div className="flex items-center gap-2">
    
      {/* Enlaces específicos por rol - sacar y meter al dropbox*/}
      {userRole === Roles.ADMIN && location.pathname !== `/private/admin/${PrivateRoutes.ADMIN_PEDIDOS}` && (
        <NavLink to={`/private/admin/${PrivateRoutes.ADMIN_PEDIDOS}`}>
          Pedidos
        </NavLink>
      )}

      {userRole === Roles.ADMIN && location.pathname !== `/private/admin/${PrivateRoutes.CREATE_PRODUCT}` && (
        <NavLink to={`/private/admin/${PrivateRoutes.CREATE_PRODUCT}`}>
          Añadir producto
        </NavLink>
      )}

      {userRole === Roles.ADMIN && location.pathname !== `/private/admin/${PrivateRoutes.DESCUENTOS}` && (
        <NavLink to={`/private/admin/${PrivateRoutes.DESCUENTOS}`}>
          Añadir descuento
        </NavLink>
      )}

      {/* Dropdown del perfil */}
      <div className="flex items-center gap-2">
        <ProfileDropdown />
      </div>
      
      {/* Favoritos para usuarios normales */}
      {userRole === Roles.USER && (
        <FavoritesButton />
      )}

      {/* Carrito solo para usuarios normales */}
        {userRole === Roles.USER && location.pathname !== `/private/${PrivateRoutes.CART}` && (
        <CartButton totalItems={totalItems} animate={animate} />
      )}

    </div>
  );
};

function Navbar() {
  const location = useLocation();
  const userState = useSelector(store => store.user);
  const [animate, setAnimate] = useState(false);
  const { cart } = useCart();

  // Memoizar cálculos pesados
  const totalItems = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cart]
  );

  const isAuthenticated = useMemo(() => 
    userState.rol !== null,
    [userState.rol]
  );

  // Optimizar la animación del carrito
  const triggerCartAnimation = useCallback(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  useEffect(() => {
    const cleanup = triggerCartAnimation();
    return cleanup;
  }, [triggerCartAnimation]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm overflow-x-hidden">
      {/* Primera fila - Logo y búsqueda */}
      <div className="bg-white px-6 py-2">
        <div className="flex items-center justify-between w-full">
          <Logo />
          <SearchBar />
          
          {!isAuthenticated && (
            <Link 
              to={`/${PublicRoutes.LOGIN}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
  
      {/* Segunda fila - Navegación */}
      <div className="bg-white px-6 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          {/* Enlaces izquierda */}
          <div className="flex items-center gap-6">
            <NavLink to={`/${PublicRoutes.HOME}`} icon={null}>
              Inicio
            </NavLink>
            
            <NavLink to="#" icon={null}>
              Ofertas
            </NavLink>
            
            <div className="relative">
              <Categorias />
            </div>
          </div>
  
          {/* Acciones usuario */}
          {isAuthenticated && (
            <UserActions 
              userRole={userState.rol} 
              location={location}
              totalItems={totalItems}
              animate={animate}
              userState={userState}
            />
          )}
        </div>
      </div>
    </div>
  );
  
}

export default Navbar;