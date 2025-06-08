import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const AdminDetailPedido = () => {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:5000/Pedidos/viewPedido/${id}`)
      .then(res => setPedido(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!pedido) return <p>Cargando...</p>

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pedido #{pedido._id}</h2>
      <p><strong>Cliente:</strong> {pedido.usuarioNombre} ({pedido.usuarioEmail})</p>
      <p>{new Date(pedido.fecha.$date).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> {pedido.estado}</p>
      <p className="mt-4"><strong>Productos:</strong></p>
      <ul className="list-disc list-inside">
        {pedido.productos.map((prod, idx) => (
          <li key={idx}>
            {prod.productoNombre} - Cantidad: {prod.cantidad}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDetailPedido
