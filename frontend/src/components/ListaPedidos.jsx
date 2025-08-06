import { useEffect, useState } from "react";
import { Clock3, Truck, ShoppingCart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Loading from "../utilities/Loading"
import EstadoPedido from "../models/Estado_Pedido/EstadoPedido";
import FilterState from "./FilterState";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  // Obtenemos el usuario de Redux
  const user = useSelector(state => state.user);

  useEffect(() => {
    fetch("http://localhost:5000/Pedidos/showPedidos", {credentials: "include" })// importante para enviar cookies de sesión/JWT
      // .then(res => res.json())
      .then(res => {
        console.log("Status:", res.status);
        return res.json();
      })
      // .then(data => setPedidos(data))
      .then(data => {
        console.log("Data:", data);
        setPedidos(data);
      })
      .catch(err => console.error("Error al obtener pedidos:", err))
      .finally(() => setIsLoading(false)); 
  }, []);

  return (
    <div className="p-6">
      {user.rol === "admin" && (
        <FilterState estado={estadoFiltro} setEstado={setEstadoFiltro} />
      )}

      <h2 className="text-2xl font-bold mb-4">
        {user.rol === "admin" ? "Pedidos de Usuarios" : "Mis Pedidos"}
      </h2>

      {isLoading ? (
        <Loading />
      ) : pedidos.length > 0 ? (
        <div className="space-y-4">
          {pedidos
            .filter(p => estadoFiltro === "" || p.estado === estadoFiltro)
            .map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`viewPedido/${p._id}`)}
                className="shadow cursor-pointer hover:bg-blue-50 rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between gap-4 border-l-4 border-blue-500"
              >
                {/* ID + Cliente (solo admin) */}
                {user.rol === "admin" && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>ID:</strong> {p._id}
                    </p>
                    <p className="text-lg font-semibold">
                      {p.usuarioNombre || "Usuario desconocido"}
                    </p>
                    <p className="text-sm text-gray-500">{p.usuarioEmail || "-"}</p>
                  </div>
                )}

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
                  <EstadoPedido estado={p.estado} />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">
          {user.rol === "admin"
            ? "No hay pedidos por el momento."
            : "Todavía no realizaste ningún pedido."}
        </p>
      )}
    </div>
  );
};

export default ListaPedidos;

