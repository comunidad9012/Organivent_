import { useEffect, useState } from "react";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pedidos de Usuarios</h2>
      <table className="min-w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">ID Pedido</th>
            <th className="border border-gray-300 p-2">Usuario</th>
            <th className="border border-gray-300 p-2">Total</th>
            <th className="border border-gray-300 p-2">Fecha</th>
            <th className="border border-gray-300 p-2">Productos</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p._id} className="border-t">
              <td className="border border-gray-300 p-2">{p._id}</td>
              <td className="border border-gray-300 p-2">{p.usuarioId}</td>
              <td className="border border-gray-300 p-2">${p.total}</td>
              <td className="border border-gray-300 p-2">
                {new Date(p.fecha.$date).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="grid gap-2">
                  {p.productos.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-2 border rounded-md bg-gray-50 shadow-sm"
                    >
                      <p><strong>ID:</strong> {prod.productoId}</p>
                      <p><strong>Cantidad:</strong> {prod.cantidad}</p>
                      <p className="flex items-center gap-2">
                        <strong>Color:</strong>
                        <span
                          className="inline-block w-4 h-4 rounded-full border-1 border-gray-300"
                          style={{ backgroundColor: prod.color.hex }}
                          title={prod.color.name}
                        ></span>
                        {prod.color.name}
                      </p>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPedidos;
