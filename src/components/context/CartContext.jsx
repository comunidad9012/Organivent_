import { createContext, useReducer, useContext, useEffect } from "react";
import { clearLocalStorage, persistLocalStorage } from "../../utilities/localStorage.utility";

export const CartKey = "cart";

// Intentar recuperar el carrito del localStorage
const getInitialCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CartKey));
    return Array.isArray(stored) ? stored : [];
  } catch (err) {
    console.error("Error leyendo el carrito desde localStorage:", err);
    return [];
  }
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) => item._id === action.payload._id);
      if (existing) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: (item.quantity || 1) + 1 } //creo que acá esta el detalle de que si el id esta le suma uno al carrito, buenisimo pero que contenga esto del color
            : item
        ); //creo que por aca podria ponerle que si el color seleccionado de determinado producto no es igual no lo sume como uno igual sino que lo ponga aparte
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "INCREMENT_QUANTITY": {
      return state.map((item) =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    
    case "DECREMENT_QUANTITY": {
      return state.map((item) =>
        item._id === action.payload
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      );
    }
      

    case "REMOVE_FROM_CART": {
      const idToRemove = typeof action.payload === 'object' ? action.payload._id : action.payload;
      return state.filter(product => product._id !== idToRemove);
    }
    
      

    case "CLEAR_CART":
      clearLocalStorage(CartKey);
      return [];

    default:
      return state;
  }
};

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del carrito para envolver la app
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, getInitialCart());

  // Guardar en localStorage cuando el carrito cambie
  useEffect(() => {
    persistLocalStorage(CartKey, cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el carrito en cualquier componente
export const useCart = () => useContext(CartContext);
