// import { useEffect, useState } from "react";

// const AdminPedidos = () => {
//   const [pedidos, setPedidos] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/Pedidos/showPedidos", {
//       credentials: "include"
//     })
//       .then(res => res.json())
//       .then(data => setPedidos(data))
//       .catch(err => console.error("Error al obtener pedidos:", err));
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Pedidos de Usuarios</h2>
//       <table className="min-w-full border-collapse border border-gray-300 shadow-md">
//         <thead className="bg-gray-100">
//           <tr className="border border-gray-300 p-2">
//             <th>ID Pedido</th>
//             <th>Usuario</th>
//             <th>Total</th>
//             <th>Fecha</th>
//             <th>Productos</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pedidos.map(p => (
//             <tr key={p._id} className="border-t">
//               <td className="border border-gray-300 p-2">{p._id}</td>
//               <td className="border border-gray-300 p-2">{p.usuarioNombre || "Usuario desconocido"}</td>
//               <td className="border border-gray-300 p-2">${p.total}</td>
//               <td className="border border-gray-300 p-2">
//                 {p.fecha?.$date
//                   ? new Date(p.fecha.$date).toLocaleString()
//                   : "Fecha no disponible"}
//               </td>
//               <td className="border border-gray-300 p-2">
//                 <div className="grid gap-2">
//                   {p.productos.map((prod, idx) => (
//                     <div
//                       key={idx}
//                       className="p-2 border rounded-md bg-gray-50 shadow-sm"
//                     >
//                       <p><strong>Nombre:</strong> {prod.productoNombre || "Nombre no disponible"}</p>
//                       <p><strong>ID:</strong> {prod.productoId}</p>
//                       <p><strong>Cantidad:</strong> {prod.cantidad}</p>
//                       <p className="flex items-center gap-2">
//                         <strong>Color:</strong>
//                         {prod.color?.hex ? (
//                           <>
//                             <span
//                               className="inline-block w-4 h-4 rounded-full border border-gray-300"
//                               style={{ backgroundColor: prod.color.hex }}
//                               title={prod.color.name}
//                             ></span>
//                             {prod.color.name}
//                           </>
//                         ) : (
//                           <span className="text-gray-500 italic">Sin color</span>
//                         )}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPedidos;

import { useEffect, useState } from "react";
import { Clock3, Truck, ShoppingCart, PackageCheck } from "lucide-react";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/Pedidos/showPedidos", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error("Error al obtener pedidos:", err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Pedidos de Usuarios</h2>

      {pedidos.map((p, idx) => (
        <div
          key={p._id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between gap-4 border-l-4 border-blue-500"
        >
          {/* ID + Cliente */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">
              <strong>ID:</strong> {p._id}
            </p>
            <p className="text-lg font-semibold">
              {p.usuarioNombre || "Usuario desconocido"}
            </p>
            <p className="text-sm text-gray-500">{p.usuarioEmail || "-"}</p>
          </div>

          {/* Entrega + Fecha */}
          <div className="flex-1 text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Entrega: {p.entrega || "Express"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              <span>
                {p.fecha?.$date
                  ? new Date(p.fecha.$date).toLocaleString()
                  : "Fecha no disponible"}
              </span>
            </div>
          </div>

          {/* Productos */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{p.productos.length} productos</span>
            </div>
            <ul className="mt-2 pl-5 list-disc text-sm text-gray-600">
              {p.productos.map((prod, i) => (
                <li key={i}>
                  {prod.productoNombre || "Producto"} x{prod.cantidad}
                </li>
              ))}
            </ul>
          </div>

          {/* Total + Estado */}
          <div className="flex flex-col items-end justify-between text-right">
            <p className="text-xl font-bold text-blue-600">
              ${parseFloat(p.total).toFixed(2)}
            </p>
            <span
              className={`text-xs font-medium mt-2 px-3 py-1 rounded-full ${
                p.estado === "Listo para enviar"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {p.estado || "Pendiente"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPedidos;
