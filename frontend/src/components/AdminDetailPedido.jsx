import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Clock, Mail, User, Truck, ShoppingCart, ImageIcon, ArrowRight
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import EstadoPedido from './Estado_Pedido/EstadoPedido'
import { EstadosPedido } from './Estado_Pedido/enums'

const AdminDetailPedido = () => {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [estadoPedido, setEstadoPedido] = useState("");
  const [selectKey, setSelectKey] = useState(0); // ⬅️ Para forzar reset visual del select


  useEffect(() => {
    axios.get(`http://localhost:5000/Pedidos/viewPedido/${id}`)
      .then(res => setPedido(res.data))
      .catch(err => console.error(err));
  }, [id]);
  

  const cambiarEstado = () => {
    axios.put(
      `http://localhost:5000/Pedidos/updateState/${pedido._id}`,
      { nuevo_estado: estadoPedido },
      { withCredentials: true }
    )
      .then(() => {
        alert("Estado actualizado");
        setPedido({ ...pedido, estado: estadoPedido });
        setEstadoPedido("");          // ⬅️ Limpiar selección
        setSelectKey(prev => prev + 1); // ⬅️ Forzar que <Select> se reinicie
      })
      .catch(err => console.error("Error al cambiar estado:", err));
  };
  

  if (!pedido) return <p className="p-6 text-gray-500">Cargando pedido...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pedido #{pedido._id}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {new Date(pedido.fecha?.$date).toLocaleString()}
        </div>
      </div>

      {/* Info del cliente */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <User className="w-5 h-5" /> Cliente
        </h3>
        <p><strong>Nombre:</strong> {pedido.usuarioNombre}</p>
        <p className="flex items-center gap-2 text-sm text-gray-700">
          <Mail className="w-4 h-4" /> {pedido.usuarioEmail}
        </p>
      </div>
      
      {/* Estado y entrega */}
      <div className="flex flex-wrap items-center gap-4">
        
      <EstadoPedido estado={pedido.estado} />

        <ArrowRight />

        <Select
          key={selectKey} // ⬅️ Forzar nuevo render
          value={estadoPedido}
          onValueChange={(value) => setEstadoPedido(value)}
        >
          <SelectTrigger className="bg-white border border-gray-300 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Cambiar estado" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50 border border-gray-200 shadow-lg rounded">
            {EstadosPedido.map((estado) => (
              <SelectItem key={estado} value={estado}>
                <EstadoPedido estado={estado} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={cambiarEstado}
          disabled={!estadoPedido}
          className={`ml-auto px-4 py-1 rounded transition text-white ${
            estadoPedido ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Cambiar estado
        </button>

        <span className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          Entrega: {pedido.entrega || "Express"}
        </span>

      </div>

      {/* Productos */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Productos
        </h3>
        <div className="space-y-4">
          {pedido.productos.map((prod, idx) => (
            <div key={idx} className="flex gap-4 border rounded-lg shadow-sm bg-gray-50 p-4 items-center">
              {/* Imagen */}
              <div className="w-24 h-24 bg-white rounded border flex items-center justify-center overflow-hidden">
                {prod.imagen ? (
                  <img
                    src={prod.imagen}
                    alt={prod.productoNombre || "Producto"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-400 w-8 h-8" />
                )}
              </div>

              {/* Detalles del producto */}
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-blue-800">{prod.productoNombre || "Producto sin nombre"}</p>
                <p className="text-sm text-gray-700">Cantidad: {prod.cantidad}</p>

                {prod.color?.name && (
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <span>Color:</span>
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: prod.color.hex }}></span>
                    <span>{prod.color.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <p className="text-xl font-bold text-blue-700">
          Total: ${parseFloat(pedido.total).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default AdminDetailPedido

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const estados = [
//   { value: "Pendiente", color: "bg-orange-100 text-orange-700" },
//   { value: "Aceptado", color: "bg-green-100 text-green-700" },
//   { value: "Listo", color: "bg-yellow-100 text-yellow-800" },
//   { value: "Cancelado", color: "bg-red-100 text-red-700" },
//   { value: "Entregado", color: "bg-blue-100 text-blue-700" },
// ];

// const AdminDetailPedido = () => {
//   const { id } = useParams();
//   const [pedido, setPedido] = useState(null);
//   const [estadoPedido, setEstadoPedido] = useState("");
//   const [modoEdicion, setModoEdicion] = useState(false);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/Pedidos/viewPedido/${id}`)
//       .then(res => {
//         setPedido(res.data);
//         setEstadoPedido(res.data.estado);
//       })
//       .catch(err => console.error(err));
//   }, [id]);

//   const cambiarEstado = () => {
//     axios.put(
//       `http://localhost:5000/Pedidos/updateState/${pedido._id}`,
//       { nuevo_estado: estadoPedido },
//       { withCredentials: true }
//     )
//     .then(() => {
//       alert("Estado actualizado");
//       setPedido({ ...pedido, estado: estadoPedido });
//       setModoEdicion(false);
//     })
//     .catch(err => console.error("Error al cambiar estado:", err));
//   };

//   if (!pedido) return <div className="text-center mt-10">Cargando pedido...</div>;

//   const estadoActual = estados.find(e => e.value === pedido.estado);

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
//       <h2 className="text-xl font-bold mb-4">Detalle del Pedido</h2>

//       <div className="mb-4">
//         <span className="font-semibold">Estado actual: </span>
//         <span className={`px-2 py-1 rounded-full text-sm font-semibold ${estadoActual?.color}`}>
//           {pedido.estado}
//         </span>
//       </div>

//       {modoEdicion ? (
//         <div className="space-y-4">
//           <select
//             value={estadoPedido}
//             onChange={(e) => setEstadoPedido(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="" disabled>Seleccionar nuevo estado</option>
//             {estados.map((estado) => (
//               <option key={estado.value} value={estado.value}>
//                 {estado.value}
//               </option>
//             ))}
//           </select>

//           <div className="flex gap-2">
//             <button
//               onClick={cambiarEstado}
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
//             >
//               Confirmar cambio
//             </button>
//             <button
//               onClick={() => setModoEdicion(false)}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md"
//             >
//               Cancelar
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setModoEdicion(true)}
//           className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md"
//         >
//           Cambiar estado
//         </button>
//       )}
//     </div>
//   );
// };

// export default AdminDetailPedido;
