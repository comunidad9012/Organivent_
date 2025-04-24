// import { useCart } from "./context/CartContext";

// const Cart = () => {
//   const { cart, dispatch } = useCart();

//   return (
//     <div className="p-4 border rounded">
//       <h2>Carrito de Compras</h2>

//       {cart.length === 0 ? (
//         <p>El carrito está vacío</p>
//       ) : (
//         <ul>
//           {cart.map((product, index) => (
//             <li key={index} className="flex justify-between p-2 border-b">
//               {product.nombre_producto} - ${product.precio_venta}
//               <button
//                 onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product._id })}
//                 className="text-red-500">
//                 Eliminar
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {cart.length > 0 && (
//         <button
//           onClick={() => dispatch({ type: "CLEAR_CART" })}
//           className="bg-red-500 p-2 mt-2 rounded"
//         >
//           Vaciar Carrito
//         </button>
//       )}
//     </div>
//   );
// };

// export default Cart;


export default function Widget() {
  return (
    <div className="flex items-center">
      <div className="flex flex-col md:flex-row p-4 bg-card rounded-lg shadow-md">

      {/* Productos */}
      
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Carrito</h2>
            <div className="flex items-start p-4 border border-zinc-300 rounded-lg">
              <img src="https://placehold.co/200x200" alt="Product Image" className="w-48 h-48 object-cover mr-4" />
              <div className="flex flex-col justify-between">
                <h2 className="text-lg text-left font-semibold mt-2 mx-4">Celular Moto G15 4 + 128 Gb Verde</h2>
                <div className="flex items-center mx-4">
                  <button className="bg-zinc-300 p-1 rounded-l">-</button>
                  <span className="mx-2">1</span>
                  <button className="bg-zinc-300 p-1 rounded-r">+</button>
                  <span className="text-sm text-muted-foreground ml-2 mx-4">+50 disponibles</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold mx-4">$ 249.999</span>
                  <button className="text-red-500">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
            
        {/* Resumen de compra */}
              
      </div>
          <div className="md:w-1/3 md:ml-4 bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Resumen de compra</h3>
              <div className="flex justify-between mb-2">
                  <span>Productos (2)</span>
                  <span>$ 258.665</span>
              </div>
              <div className="flex justify-between mb-2">
                  <span>Envío</span>
                  <span className="text-green-500">Gratis</span>
              </div>
              <div className="flex justify-between font-bold mb-4">
                  <span>Total</span>
                  <span>$ 258.665</span>
              </div>
              <button className="text-primary-foreground w-full p-2 rounded">Continuar compra</button>
          </div>
    </div>
  )
}
