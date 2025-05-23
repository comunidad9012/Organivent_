import { useState } from "react";
import { useCart } from "./context/CartContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // para redirigir
import { PublicRoutes } from "../models/routes";

import '../styles/CartProduct.css';

function CartProduct({ product , selectedColor}) {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const user = useSelector((state) => state.user);
  const hasColorOptions = Array.isArray(product.colores) && product.colores.length > 0;

  const isFormValid = (!hasColorOptions || selectedColor) 
  // && (!hasSizeOptions || selectedSize) 
  // && (!hasPaperOptions || selectedPaper);

  
//--------------------------------
  // Verificar si el producto ya está en el carrito | lo saqué para que el usuario pueda agregar otro del mismo producto
  // useEffect(() => {
  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   const isAlreadyInCart = cart.some(item => item._id === product._id);
  //   setAdded(isAlreadyInCart);
  // }, [product._id]);
  
  // const addToCart = () => {
  //   dispatch({ type: "ADD_TO_CART", payload: product });
  //   setAdded(true);
  // };
//---------------------------------

  const addToCart = () => {
    const productWithColor = {
      ...product,
      selectedColor: selectedColor || null, // null si no se pasa nada
    };
    dispatch({ type: "ADD_TO_CART", payload: productWithColor });
    setAdded(true);
  };

  const removeFromCart = () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
    setAdded(false);
  };

  const handleClick = () => {
    if (!user.isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate(`/${PublicRoutes.LOGIN}`); // poner esto mismo en el carrito para cuando lo quiera ver un usuario no logueado
      return;
    }
  
    if (added) {
      removeFromCart();
    } else {
      addToCart();
    }
  };
  

  return (
    <div>
      {hasColorOptions && !selectedColor && (
        <p className="text-sm text-red-500 text-center mt-2">
          Selecciona un color para continuar
        </p>
      )}
      
      <button
        className={`cartBtn mx-auto ${added ? 'added' : ''}`}
        onClick={handleClick}
        disabled={!isFormValid}
      >
        <svg className="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
        </svg>
        {added ? "¡Agregado!" : "Añadir al carrito"}
      </button>
  </div>
  );
}

export default CartProduct;
