import { Link } from 'react-router-dom';
import { TicketPlus } from 'lucide-react';
import { PrivateRoutes } from '../models/routes';
import { useEffect, useState } from 'react';

function ListDiscount() {
    const [descuentos, setDescuentos] = useState([]);

     // Traer descuentos al cargar
    useEffect(() => {
        fetch("http://localhost:5000/Descuentos/showDescuentos")
        .then((res) => res.json())
        .then((data) => {
            setDescuentos(data);
        })
        .catch((err) => console.error("⚠️ Error cargando descuentos:", err));
    }, []);

  return (
    <>
        <div>
            <h1>Lista de descuentos</h1>
            <Link to={`/private/admin/${PrivateRoutes.CREATE_DESCUENTO}`}>
                <div className='grid grid-cols-4 gap-2 items-center text-green-600 text-center w-60 bg-green-100 rounded hover:bg-green-200 cursor-pointer'>
                    <TicketPlus className='justify-self-end'/>
                    <p className='col-span-3 m-1 text-left '>
                    Crear descuento
                    </p>
                </div>
            </Link>

            <ul className="mt-2 space-y-2">
        {descuentos.map((d) => (
          <li key={d._id} className="p-3 bg-gray-100 rounded shadow">
            <p><span className="font-bold">Nombre:</span> {d.nombre}</p>
            <p><span className="font-bold">Tipo:</span> {d.tipo}</p>
            <p><span className="font-bold">Valor:</span> {d.valor}</p>
            <p><span className="font-bold">Activo:</span> {d.activo ? "✅" : "❌"}</p>
            <p><span className="font-bold">Categorías:</span> {d.categorias?.join(", ")}</p>
            <p><span className="font-bold">Productos:</span> {d.productos?.join(", ")}</p>
          </li>
        ))}
      </ul>


        </div>
    </>
  );
}
export default ListDiscount;
