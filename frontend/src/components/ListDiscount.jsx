import { Link } from "react-router-dom";
import { TicketPlus, Percent, CircleDollarSign, SquarePen } from "lucide-react";
import { PrivateRoutes } from "../models/routes";
import { useEffect, useState } from "react";
import DeleteItem from '../utilities/DeleteItem';

function ListDiscount() {
  const [descuentos, setDescuentos] = useState([]);

  // Traer descuentos al cargar
  useEffect(() => {
    fetch("http://localhost:5000/Descuentos/showDescuentos")
      .then((res) => res.json())
      .then((data) => {
        setDescuentos(data);
        console.log("✅ Descuentos cargados:", data);
      })
      .catch((err) => console.error("⚠️ Error cargando descuentos:", err));
  }, []);

  return (
    <div className="p-6">
      <h1>Lista de descuentos</h1>
      <Link to={`/private/admin/${PrivateRoutes.CREATE_DESCUENTO}`}>
        <div className="justify-self-center grid grid-cols-4 gap-2 items-center text-green-600 text-center w-60 mb-4 bg-green-100 rounded hover:bg-green-200 cursor-pointer">
          <TicketPlus className="justify-self-end" />
          <p className="col-span-3 m-1 text-left ">Crear descuento</p>
        </div>
      </Link>

      {/* Lista de tarjetas */}
      <div className="space-y-4">
        {descuentos.map((d) => {
          const bordeColor =
            d.tipo === "porcentaje" ? "border-blue-400" : "border-green-400";

          return (
            <div
              key={d._id}
              className={`p-5 bg-white rounded-lg shadow-md border-l-4 ${bordeColor} flex flex-col gap-3`}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">{d.nombre}</p>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    d.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {d.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                {d.tipo === "porcentaje" ? (
                  <Percent className="text-blue-500" />
                ) : (
                  <CircleDollarSign className="text-green-500" />
                )}
                <span className="font-semibold">
                  {d.tipo === "porcentaje"
                    ? `${d.valor}%`
                    : `$${d.valor}`}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-medium">Categorías:</span>{" "}
                  {d.categorias_detalle?.length
                  ? d.categorias_detalle.map(c => c.nombre).join(", ")
                  : "Ninguna"}
                </p>
                <p>
                  <span className="font-medium">Productos:</span>{" "}
                  {d.productos_detalle?.length
                  ? d.productos_detalle.map(p => p.nombre).join(", ")
                  : "Ninguno"}
                </p>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <p>Inicio: {new Date(d.fecha_inicio).toLocaleDateString()}</p>
                <p>Fin: {new Date(d.fecha_fin).toLocaleDateString()}</p>
              </div>

              
                <div className="mt-auto flex justify-end gap-2">
                {/* Botón editar */}
                <Link 
                    to={`/private/admin/descuentos/update/${d._id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow"
                >
                    <SquarePen size={18}/>
                </Link>

                {/* Botón borrar */}
                <DeleteItem
                    item={d}
                    itemName={d.nombre}
                    resource="Descuentos"
                    setItems={setDescuentos}
                    getId={(d) => d._id}
                />

                </div>
                
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListDiscount;
