import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
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

import EstadoPedido from '../models/Estado_Pedido/EstadoPedido'
import { EstadosPedido } from '../models/Estado_Pedido/enums'
import { toast } from "sonner"

const DetallePedido = () => {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [estadoPedido, setEstadoPedido] = useState("")
  const [selectKey, setSelectKey] = useState(0)

  // 📌 Obtener rol desde Redux
  const { rol } = useSelector((state) => state.user)

  useEffect(() => {
    axios.get(`http://localhost:5000/Pedidos/viewPedido/${id}`, { withCredentials: true })
      .then(res => setPedido(res.data))
      .catch(err => {
        if (err.response?.status === 403) {
          setPedido({ error: "No tienes permiso para ver este pedido" })
        } else {
          console.error(err)
        }
      })
  }, [id])

  const cambiarEstado = () => {
    axios.put(
      `http://localhost:5000/Pedidos/updateState/${pedido._id}`,
      { nuevo_estado: estadoPedido },
      { withCredentials: true }
    )
      .then(() => {
        toast.success("Se cambió el estado correctamente")
        setPedido({ ...pedido, estado: estadoPedido })
        setEstadoPedido("")
        setSelectKey(prev => prev + 1)
      })
      .catch(err => {
        console.error("Error al cambiar estado:", err)
        toast.error("Error al cambiar el estado del pedido.")
      })
  }

  if (!pedido) return <p className="p-6 text-gray-500">Cargando pedido...</p>
  if (pedido.error) return <p className="p-6 text-red-500">{pedido.error}</p>

  return (
    <>
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold m-4">Pedido #{pedido._id}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {new Date(pedido.fecha?.$date).toLocaleString()}
        </div>
      </div>

      {/* Estado y entrega */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <EstadoPedido estado={pedido.estado} />

        {rol === "admin" && (
          <>
            <ArrowRight />

            <Select
              key={selectKey}
              value={estadoPedido}
              onValueChange={(value) => setEstadoPedido(value)}
            >
              <SelectTrigger className="bg-white border border-gray-300 shadow-sm rounded px-3 py-2">
                <SelectValue placeholder="Cambiar estado" />
              </SelectTrigger>
              <SelectContent>
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
              className={`ml-auto px-4 py-1 rounded text-white ${
                estadoPedido ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Cambiar estado
            </button>
          </>
        )}

        <span className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          Entrega: {pedido.entrega || "Express"}
        </span>
      </div>

      {/* Layout dividido */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Columna Izquierda - Cliente (solo admin ve todo) */}
        {rol === "admin" && (
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 md:w-1/3">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <User className="w-5 h-5" /> Cliente
            </h3>
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              {pedido.usuarioNombre}
            </p>
            <p className="flex items-start gap-2 text-sm text-gray-700 break-all">
              <Mail className="w-4 h-4 mt-[2px]" />
              <span>{pedido.usuarioEmail}</span>
            </p>
          </div>
        )}

        {/* Columna Derecha - Productos */}
        <div className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 ${rol === "admin" ? "md:w-2/3" : "w-full"}`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Productos
          </h3>
          <div className="space-y-4">
            {pedido.productos.map((prod, idx) => (
              <div key={idx} className="flex gap-4 border rounded-lg shadow-sm bg-gray-50 p-4 items-center">
                <div className="w-24 h-24 bg-white rounded border flex items-center justify-center overflow-hidden">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt={prod.productoNombre || "Producto"} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1 space-y-1 text-left pl-2">
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
            <div className="flex justify-end">
              <p className="text-xl font-bold text-blue-700">
                Total: ${parseFloat(pedido.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetallePedido
