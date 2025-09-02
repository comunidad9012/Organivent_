import { createContext, useReducer, useContext, useEffect } from "react";
import { persistLocalStorage } from "../../utilities/localStorage.utility";
import isSameProduct from "../../utilities/isSameProduct";
import { useSelector } from "react-redux";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find(item => isSameProduct(item, action.payload));
      if (existing) {
        return state.map(item =>
          isSameProduct(item, action.payload)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "INCREMENT_QUANTITY":
      return state.map(item =>
        item._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
    case "DECREMENT_QUANTITY":
      return state.map(item =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );
    case "REMOVE_FROM_CART": {
      const idToRemove = typeof action.payload === "object" ? action.payload._id : action.payload;
      return state.filter(product => product._id !== idToRemove);
    }
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
  const storageKey = user?.email || user?.nombre_usuario
  ? `cart_${user.email || user.nombre_usuario}`
  : "cart_guest";

  const [cart, dispatch] = useReducer(cartReducer, []);

  // 1) cuando cambia la clave (login/logout), cargar el carrito almacenado
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      dispatch({ type: "REPLACE_CART", payload: Array.isArray(stored) ? stored : [] });
    } catch (e) {
      console.error("No se pudo cargar el carrito del usuario", e);
      dispatch({ type: "REPLACE_CART", payload: [] });
    }
  }, [storageKey]);

  // 2) persistir SOLO cuando cambia el carrito
  useEffect(() => {
    try {
      persistLocalStorage(storageKey, cart);
    } catch (e) {
      console.error("Error al persistir carrito:", e);
    }
  }, [cart]); // << importante: no include storageKey aquí

  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
