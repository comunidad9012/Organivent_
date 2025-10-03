import { useState, useEffect } from "react";
import { useCart } from "./context/CartContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../models/routes";

import "../styles/CartProduct.css";

function CartProduct({ product, selectedVariante }) {
  const navigate = useNavigate();
  const { cart, dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const user = useSelector((state) => state.user);

  // Si el producto tiene variantes, validamos que haya seleccionado una
  const hasVariants =
    Array.isArray(product.variantes) && product.variantes.length > 0;
  const isFormValid = !hasVariants || selectedVariante;

  useEffect(() => {
    const isInCart = cart.some(
      (item) =>
        item._id === product._id &&
        JSON.stringify(item.selectedVariante) ===
          JSON.stringify(selectedVariante)
    );
    setAdded(isInCart);
  }, [cart, product._id, selectedVariante]);

  // const addToCart = () => {
  //   // 1️⃣ Determinar el stock disponible
  //   let stockDisponible = 0;

  //   if (selectedVariante) {
  //     // Caso con variante seleccionada
  //     stockDisponible = selectedVariante?.stock?.cantidad ?? 0;
  //   } else if (product.variantes?.length > 0) {
  //     // Caso producto sin opciones → usar la única variante
  //     stockDisponible = product.variantes[0]?.stock?.cantidad ?? 0;
  //   }

  //   // 2️⃣ Guardar el producto con su stock real
  //   const productWithVariante = {
  //     ...product,
  //     selectedVariante: selectedVariante || null,
  //     stockDisponible, // 👈 ahora viaja al cart
  //   };

  //   console.log("Adding to cart:", productWithVariante);

  //   // 3️⃣ Dispatch al cart
  //   dispatch({ type: "ADD_TO_CART", payload: productWithVariante });
  //   setAdded(true);
  // };

  const addToCart = () => {
    let stockDisponible = 0;
    let varianteId = null;

    if (selectedVariante) {
      stockDisponible = selectedVariante?.stock?.cantidad ?? 0;
      varianteId = selectedVariante?._id;
    } else if (product.variantes && product.variantes.length > 0) {
      stockDisponible = product.variantes[0]?.stock?.cantidad ?? 0;
      varianteId = product.variantes[0]?._id;
    }

    if (stockDisponible <= 0) {
      alert("Lo sentimos, no hay stock disponible de este producto.");
      return;
    }

    const productWithVariante = {
      ...product,
      selectedVariante: selectedVariante || null,
      stockDisponible,
      variante_id: varianteId,
    };

    dispatch({ type: "ADD_TO_CART", payload: productWithVariante });
    setAdded(true);
  };

  const removeFromCart = () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
    setAdded(false);
  };

  const handleClick = () => {
    if (!user.isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate(`/${PublicRoutes.LOGIN}`);
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
      <button
        className={`cartBtn mx-auto ${added ? "added" : ""}`}
        onClick={handleClick}
        disabled={
          !isFormValid ||
          selectedVariante?.stock?.cantidad === 0 ||
          (!selectedVariante &&
            product.variantes &&
            product.variantes.length > 0 &&
            product.variantes[0]?.stock?.cantidad === 0)
        }
      >
        <svg
          className="cart"
          fill="white"
          viewBox="0 0 576 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
        </svg>
        {added ? "¡Agregado!" : "Añadir al carrito"}
      </button>
    </div>
  );
}

export default CartProduct;
