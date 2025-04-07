import { useCart } from "./context/CartContext"

function CartProduct( {product }) {

  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <button onClick={addToCart} className="bg-blue-500 p-2 mt-2 rounded">
        Agregar al carrito
    </button>
  )
}
export default CartProduct