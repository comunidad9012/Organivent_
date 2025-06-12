import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Clock, Mail, User, Truck, ShoppingCart, ImageIcon
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
  const [estadoPedido, setEstadoPedido] = useState(""); //estadoPedido || "Pendiente"}

  useEffect(() => {
    axios.get(`http://localhost:5000/Pedidos/viewPedido/${id}`)
      .then(res => setPedido(res.data))
      .catch(err => console.error(err))
  }, [id])

  const cambiarEstado = () => {
    axios.put(
      `http://localhost:5000/Pedidos/updateState/${pedido._id}`,
      { nuevo_estado: estadoPedido },
      { withCredentials: true } // ⬅️ esto asegura que se envíe la cookie 'jwt'
    )
    .then(() => {
      alert("Estado actualizado");
      setPedido({ ...pedido, estado: estadoPedido });
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
        {/* <span className={`text-sm px-4 py-1 rounded-full font-medium ${
          pedido.estado === "Listo para enviar"
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800"
        }`}>
          {pedido.estado || "Pendiente"}
        </span> */}


      <Select onValueChange={(value) => setEstadoPedido(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar estado" /><EstadoPedido estado={estadoPedido || "Pendiente"} />
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          {EstadosPedido.map((estado) => (
            <SelectItem key={estado} value={estado}>
              {estado}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

        <span className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          Entrega: {pedido.entrega || "Express"}
        </span>
        {/* <button
          onClick={cambiarEstado}
          className="ml-auto bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Cambiar estado
        </button> */}
        <button
          onClick={cambiarEstado}
          disabled={!estadoPedido}
          className={`ml-auto px-4 py-1 rounded transition text-white ${
            estadoPedido ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Cambiar estado
        </button>

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
