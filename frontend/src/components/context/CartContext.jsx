import { createContext, useReducer, useContext, useEffect } from "react";
import { persistLocalStorage } from "../../utilities/localStorage.utility";
import { useSelector } from "react-redux";
import isSameProduct from "../../utilities/isSameProduct";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) =>
        isSameProduct(item, action.payload)
      );
      if (existing) {
        return state.map((item) =>
          isSameProduct(item, action.payload)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "INCREMENT_QUANTITY":
      return state.map((item) =>
        isSameProduct(item, action.payload)
          ? {
              ...item,
              quantity:
                item.quantity < item.stockDisponible
                  ? item.quantity + 1
                  : item.quantity,
            }
          : item
      );

    case "DECREMENT_QUANTITY":
      return state.map((item) =>
        isSameProduct(item, action.payload)
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );

    case "REMOVE_FROM_CART":
      return state.filter((item) => !isSameProduct(item, action.payload));

    case "CLEAR_CART":
      return [];

    case "REPLACE_CART":
      return Array.isArray(action.payload) ? action.payload : [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const user = useSelector((state) => state.user);

  const storageKey =
    user?.email || user?.nombre_usuario
      ? `cart_${user.email || user.nombre_usuario}`
      : "cart_guest";

  const [cart, dispatch] = useReducer(cartReducer, []);

  // 🔹 Cargar carrito guardado al cambiar usuario/login
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      dispatch({
        type: "REPLACE_CART",
        payload: Array.isArray(stored) ? stored : [],
      });
    } catch (e) {
      console.error("No se pudo cargar el carrito del usuario", e);
      dispatch({ type: "REPLACE_CART", payload: [] });
    }
  }, [storageKey]);

  // 🔹 Guardar carrito cada vez que cambie
  useEffect(() => {
    try {
      persistLocalStorage(storageKey, cart);
    } catch (e) {
      console.error("Error al persistir carrito:", e);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
