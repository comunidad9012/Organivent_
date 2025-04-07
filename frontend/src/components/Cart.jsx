import { useCart } from "./context/CartContext";

const Cart = () => {
  const { cart, dispatch } = useCart();

  return (
    <div className="p-4 border rounded">
      <h2>Carrito de Compras</h2>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cart.map((product, index) => (
            <li key={index} className="flex justify-between p-2 border-b">
              {product.nombre_producto} - ${product.precio_venta}
              <button
                onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product._id })}
                className="text-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <button
          onClick={() => dispatch({ type: "CLEAR_CART" })}
          className="bg-red-500 p-2 mt-2 rounded"
        >
          Vaciar Carrito
        </button>
      )}
    </div>
  );
};

export default Cart;
