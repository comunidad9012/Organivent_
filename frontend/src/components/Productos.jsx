import { useState, useEffect , Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import DeleteProduct from './DeleteProduct.jsx';
import store from '../redux/store.js';
import { useSelector } from 'react-redux';
import { Roles } from '../models/roles.js';
import limitText from '../utilities/limitText.jsx';
import Precio from '../utilities/Precio.jsx';
import FavButton from "./FavButton";
import { Edit, ShoppingCart } from 'lucide-react';
import { FiltersContext } from './context/filters.jsx'
import Paginacion from './Paginacion.jsx';

import { SquarePen } from 'lucide-react';


function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { filters, setFilters } = useContext(FiltersContext) //consumo el contexto de los filtros
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no
  const navigate = useNavigate();


  // Fetch para obtener los productos y tambien por categoría
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const url = filters.id_categoria
          ? `http://localhost:5000/Productos/showProductosPorCategoria/${filters.id_categoria}`
          : "http://localhost:5000/Productos/showProductos";
        const response = await fetch(url);
        const data = await response.json();
        setProductos(data);
        setCurrentPage(1); // reset página al cambiar filtros
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, [filters.id_categoria]); // Se ejecuta cuando `categoria` cambia

  // paginacion
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = Productos.slice(startIndex, endIndex);

  return (
    <>
    <h1 className="text-2xl font-bold">Productos</h1>
    <div className="flex flex-row gap-4">

  {/* Panel lateral de filtros*/}
  <div className="basis-1/6 p-4 bg-gray-50 rounded mt-4 text-left">
    <p className='text-gray-300'>aca podriamos poner "categoria / subcategoria" (componente shadcn-ui) y abajo hacer un fetch con las subcategorias </p>
    <h5 className="font-semibold mb-2">Categoría</h5>

{filters.id_categoria ? (
  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
    {filters.category}
    <button
      onClick={() => setFilters({ category: "", id_categoria: "" })}
      className="mx-2 text-blue-500 hover:text-blue-700 focus:outline-none"
    >
      ✕
    </button>
  </div>
) : (
  <p className="text-gray-500">Todos los productos</p>
)}

  </div>

  {/* Zona principal */}
  <div className="basis-5/6">
    <div className="text-center">
      

    {currentProducts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {currentProducts.map(product => (
          <div 
            key={product._id} 
            onClick={() => navigate(
              userState.rol === null 
                ? `/Productos/viewproduct/${product._id}` 
                : `Productos/viewproduct/${product._id}`
            )}
            className="border cursor-pointer hover:shadow-xl rounded-lg p-4 flex flex-col"
          >
            <img
              src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
              alt={product.nombre_producto}
              className="w-full h-60 object-contain mt-4"
            />
            
            <div className="card-body flex flex-col flex-1 gap-4">
              <h5 className="card-title">{product.nombre_producto}</h5>
              <p>{limitText(product.descripcion, 100)}</p>
              
              <Precio valor={Number(product.precio_venta)} className="mx-auto mb-4 text-blue-700"/>

              {userState.rol === Roles.ADMIN && (
                <div className="mt-auto flex justify-end gap-2">
                  {/* Botón editar */}
                  <Link 
                    to={`/private/admin/Productos/update/${product._id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow"
                  >
                    <SquarePen size={18}/>
                  </Link>

                  {/* Botón borrar */}
                  <DeleteProduct product={product} setProductos={setProductos}/>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No hay productos disponibles.</p>
    )}

    </div>

     {/* Paginar */}
          <Paginacion
            totalItems={Productos.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage} 
          />
  
  </div>
</div>

</>

  );
}

export default Productos;