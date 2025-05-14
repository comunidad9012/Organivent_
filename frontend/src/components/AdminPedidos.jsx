import React, { useEffect, useState } from "react";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/Pedidos/showPedidos", {
      credentials: "include"  // importante si usás cookies para el login
    })
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error("Error al obtener pedidos:", err));
  }, []);

  fetch("http://localhost:5000/Pedidos/checkSession", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(console.log);

    
  return (
    <div>
      <h2>Pedidos de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p._id}>
              <td>{p._id}</td>
              <td>{p.usuarioId}</td>
              <td>${p.total}</td>
              <td>
                {p.productos.map((prod, idx) => (
                  <div key={idx}>
                    Producto ID: {prod.productoId}, Cantidad: {prod.cantidad}, Color: {prod.color}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPedidos;
