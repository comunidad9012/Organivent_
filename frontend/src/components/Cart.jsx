import { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import Loading from "../utilities/Loading";
import useCrearPedido from "./hooks/useCrearPedido";
import Precio from "../utilities/Precio";

export default function Cart() {
  const { cart, dispatch } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const { handleComprar, loading, messagePedido } = useCrearPedido();

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.precio_venta * (item.quantity || 1), 0);
    setSubtotal(total);
  }, [cart]);

  const isEmpty = cart.length === 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 min-h-[60vh]">
      {/* Contenido principal */}
      <div className="flex-1 bg-card rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6">Carrito</h2>

        {isEmpty ? (
          <div className="mt-8 flex flex-col md:flex-row gap-4 w-full">
            {/* Columna izquierda: mensaje */}
            <div className="flex-2 flex items-center justify-center bg-white border rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 w-full">
                {/* Ícono */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-gray-600 ml-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5.4a1 1 0 001 1.6H19m-12 0a1 1 0 11-2 0m12 0a1 1 0 112 0" />
                </svg>

                <div className="md:w-2/3 mt-10">
                  <h3 className="text-lg font-semibold">Ups! ¡no hay productos aún!</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ¡Añade productos al carrito y descubre tus descuentos!
                  </p>
                </div>
                  <a href="/tienda" className="text-blue-600 hover:underline text-sm mt-2 inline-block justify-items-end">
                    Descubrir productos
                  </a>
              </div>
            </div>

            {/* Columna derecha: resumen vacío */}
            <div className="md:w-1/3 bg-white rounded-lg shadow-md p-6 border border-gray-100 text-gray-400">
              <h3 className="text-lg font-bold mb-2">Resumen de compra</h3>
              <hr className="mb-2" />
              <p className="text-sm">Acá verás los importes de tu compra una vez que agregues productos.</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {cart.map((product, index) => (
                <li key={index} className="flex flex-col md:flex-row items-start gap-4 border border-zinc-300 rounded-lg p-4">
                 <img
                    src={
                      product.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0]
                        : "https://placehold.co/200x200"
                    }
                    alt={product.nombre_producto}
                    className="w-48 h-48 object-cover rounded-lg border"
                  />

                  <div className="flex flex-col justify-between">
                    <h2 className="text-lg font-semibold mt-2">{product.nombre_producto}</h2>
                    {product.selectedColor && (
                      <div className="flex items-center my-2">
                        <span className="text-sm text-muted-foreground mr-2">
                          Color: {product.selectedColor.name}
                        </span>
                        <div
                          className="w-5 h-5 rounded-full border border-gray-400"
                          style={{ backgroundColor: product.selectedColor.hex }}
                        />
                      </div>
                    )}
                    <div className="flex items-center my-2">
                      <button
                        onClick={() => dispatch({ type: "DECREMENT_QUANTITY", payload: product._id })}
                        className="bg-zinc-300 px-2 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="mx-3">{product.quantity || 1}</span>
                      <button
                        onClick={() => dispatch({ type: "INCREMENT_QUANTITY", payload: product._id })}
                        className="bg-zinc-300 px-2 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                      <span className="text-sm text-muted-foreground ml-4">+50 disponibles</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Precio valor={Number(product.precio_venta)} className="font-semibold text-xl text-blue-700" />
                      <button
                        onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product })}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="button-pretty mt-6"
            >
              Vaciar Carrito
            </button>
          </>
        )}
      </div>

      {/* Resumen de compra */}
      {!isEmpty && (
        <div className="md:w-1/3 bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Resumen de compra</h3>
          <div className="flex justify-between mb-2">
            <span>Productos ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)})</span>
            <Precio valor={Number(subtotal)} className="text-blue-700" />
          </div>
          <div className="flex justify-between mb-2">
            <span>Envío</span>
            <span className="text-green-500">Gratis</span>
          </div>
          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <Precio valor={Number(subtotal)} className="text-xl font-bold text-blue-700" />
          </div>

          {loading && <Loading />}

          <button className="button-pretty w-full" onClick={handleComprar} disabled={loading}>
            {loading ? "Procesando..." : "Continuar compra"}
          </button>

          {/* TODO: Reemplazar por toast */}
          {messagePedido && <p className="mt-4 text-green-600">{messagePedido}</p>}
        </div>
      )}
    </div>
  );
}
