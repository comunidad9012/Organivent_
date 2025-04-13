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
                className="text-red-500">
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


// export default function Widget() {
//   return (
//       <div className="flex flex-col md:flex-row p-4 bg-card rounded-lg shadow-md">
//           <div className="flex-1">
//               <h2 className="text-lg font-bold mb-4">Productos ⚡ FULL</h2>
//               <div className="border-b pb-4 mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center">
//                           <img src="https://placehold.co/100x100" alt="Celular Moto G15" className="mr-2" />
//                           <span>Celular Moto G15 4 + 128 Gb Verde</span>
//                       </div>
//                       <div className="flex items-center">
//                           <button className="bg-secondary text-secondary-foreground p-1 rounded">-</button>
//                           <span className="mx-2">1</span>
//                           <button className="bg-secondary text-secondary-foreground p-1 rounded">+</button>
//                       </div>
//                       <span>$ 249.999</span>
//                       <button className="text-destructive">Eliminar</button>
//                   </div>
//                   <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center">
//                           <img src="https://placehold.co/100x100" alt="Auriculares Inalambricos" className="mr-2" />
//                           <span>Auriculares Inalambricos Gamer Alpina F40 Pro Bluetooth</span>
//                       </div>
//                       <div className="flex items-center">
//                           <button className="bg-secondary text-secondary-foreground p-1 rounded">-</button>
//                           <span className="mx-2">1</span>
//                           <button className="bg-secondary text-secondary-foreground p-1 rounded">+</button>
//                       </div>
//                       <span className="text-muted">$ 8.666</span>
//                       <button className="text-destructive">Eliminar</button>
//                   </div>
//               </div>
//               <div className="flex items-center justify-between">
//                   <span>Envío</span>
//                   <span className="text-green-500">Gratis</span>
//               </div>
//               <div className="w-full bg-muted h-1 my-2">
//                   <div className="bg-green-500 h-full"></div>
//               </div>
//               <span>Aprovechá tu envío gratis agregando más productos Full. <a href="#" className="text-blue-500">Ver más productos Full </a></span>
//           </div>
//           <div className="md:w-1/3 md:ml-4 bg-card p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-bold mb-4">Resumen de compra</h3>
//               <div className="flex justify-between mb-2">
//                   <span>Productos (2)</span>
//                   <span>$ 258.665</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                   <span>Envío</span>
//                   <span className="text-green-500">Gratis</span>
//               </div>
//               <div className="flex justify-between font-bold mb-4">
//                   <span>Total</span>
//                   <span>$ 258.665</span>
//               </div>
//               <button className="bg-primary text-primary-foreground w-full p-2 rounded">Continuar compra</button>
//           </div>
//       </div>
//   )
// }
