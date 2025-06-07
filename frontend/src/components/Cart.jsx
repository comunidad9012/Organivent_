import { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import Loading from "../utilities/Loading";
import useCrearPedido from "./hooks/useCrearPedido";


export default function Cart() {

  const { cart, dispatch } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const { handleComprar, loading, messagePedido } = useCrearPedido();

  // para que se actualice el subtotal segun los cambios en el carrito
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.precio_venta * (item.quantity || 1), 0);
    setSubtotal(total);
  }, [cart]);



  return (
    <div className="flex items-center">
      <div className="flex flex-col md:flex-row p-4 bg-card rounded-lg shadow-md">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Carrito</h2>

          {/* Productos */}
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul>
          {cart.map((product, index) => (
            <li key={index} className="flex items-start p-4 border border-zinc-300 rounded-lg">
              <img src="https://placehold.co/200x200" alt="Product Image" className="w-48 h-48 object-cover mr-4" />
              <div className="flex flex-col justify-between">
                <h2 className="text-lg text-left font-semibold mt-2 mx-4">{product.nombre_producto}</h2>
                {product.selectedColor && (
                  <div className="flex items-center mx-4 my-1">
                    <span className="text-sm text-muted-foreground mr-2">Color: {product.selectedColor.name}</span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-400"
                      style={{ backgroundColor: product.selectedColor.hex }}
                    ></div>
                  </div>
                )}

                <div className="flex items-center mx-4">
                <button
                  onClick={() => dispatch({ type: "DECREMENT_QUANTITY", payload: product._id })}
                  className="bg-zinc-300 p-1 rounded w-4 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="mx-2">{product.quantity || 1}</span>
                <button
                  onClick={() => dispatch({ type: "INCREMENT_QUANTITY", payload: product._id })}
                  className="bg-zinc-300 p-1 rounded w-4 hover:bg-gray-200"
                >
                  +
                </button>

                  <span className="text-sm text-muted-foreground ml-2 mx-4">+50 disponibles</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold mx-4">${product.precio_venta}</span>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product })}
                    className="text-red-500 hover:text-red-700"> Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
       {cart.length > 0 && (
        <button
          onClick={() => dispatch({ type: "CLEAR_CART" })}
          className="button-pretty"
        >
          Vaciar Carrito
        </button> 
      )}
          </div>
            
        {/* Resumen de compra */}
              
      </div>
          <div className="md:w-1/3 md:ml-4 bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Resumen de compra</h3>
              <div className="flex justify-between mb-2">
                <span>Productos ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)})</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                  <span>Envío</span>
                  <span className="text-green-500">Gratis</span>
              </div>

              <div className="flex justify-between font-bold mb-4">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {loading && <Loading/>}

              <button className="button-pretty" onClick={handleComprar} disabled={loading}>
                {loading ? "Procesando..." : "Continuar compra"}
              </button>

              {messagePedido && <p>{messagePedido}</p>}

          </div>
    </div>
  )
}
