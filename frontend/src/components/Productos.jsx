import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
// import DeleteProduct from './DeleteProduct.jsx';
import DeleteItem from '../utilities/DeleteItem';

import store from '../redux/store.js';
import { useSelector } from 'react-redux';
import { Roles } from '../models/roles.js';
import Precio from '../utilities/Precio.jsx';
import FavButton from "./FavButton";
import { ShoppingCart, SquarePen, Ticket} from 'lucide-react';
import { FiltersContext } from './context/filters.jsx'
import Paginacion from './Paginacion.jsx';


function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
     {/* Products Grid */}

      <div className="max-w-3xl mx-auto px-2 py-6">
        {Productos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
              >
              <div className="relative aspect-square bg-white overflow-hidden group">
                
                {/* Botón de favorito en la esquina superior derecha */}
                 <FavButton productId={product._id} />

                {/* Colores disponibles en la esquina superior izquierda */}
                {product.colores?.length > 0 && (
                  <p className="absolute top-2 left-2 z-10 text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-600">
                    {product.colores.length} colores!
                  </p>
                )}

                {/* Imagen clickeable */}
                <Link to={`/Productos/viewproduct/${product._id}`} className="block relative z-0">
                  <img
                    src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
                    alt={product.nombre_producto}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

             <Link to={`/Productos/viewproduct/${product._id}`} className="block">              
                {/* Info */}
                <div className="p-3 space-y-2 bg-gray-50">
                  {product.descuento_aplicado ? (
                    <div className="flex flex-col space-y-1">
                       {/* Precio original tachado */}
                      <p className="text-left text-gray-500 text-sm line-through mb-1">
                        ${Number(product.precio_original).toLocaleString("es-AR")}
                      </p>
                      <div className='grid grid-cols-2 gap-2 items-center'>
                        {/* Precio con descuento */}
                        <Precio 
                          valor={Number(product.precio_final)} 
                          className="text-black font-bold text-lg"
                        />
                        {/* Badge del descuento */}
                        <span className="w-15 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {product.descuento_aplicado.tipo === "porcentaje" 
                            ? `-${product.descuento_aplicado.valor}%`
                            : `-$${product.descuento_aplicado.valor}`}
                        </span>
                      </div>
                        <div className='grid grid-cols-4 gap-2 items-center text-xs text-green-800 bg-green-100 rounded text-center'>
                          <Ticket className='ml-3 w-5'/>
                          <p className='col-span-3 m-1 text-left '>
                            {product.descuento_aplicado.nombre}
                          </p>
                        </div>
                    </div>
                  ) : (
                    // Si no tiene descuento, muestro solo el precio normal
                    <Precio 
                      valor={Number(product.precio_venta)} 
                      className="text-black font-bold text-lg"
                    />
                  )}

                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors">
                    {product.nombre_producto}
                  </h3>
                </div>
              </Link>


                {/* Admin Actions */}
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
                    {/* <DeleteProduct product={product} setProductos={setProductos}/> */}
                    <DeleteItem
                      item={product}
                      itemName={product.nombre_producto}
                      resource="Productos"
                      setItems={setProductos}
                      getId={(p) => p._id}
                    />

                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart size={96} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros o vuelve más tarde.</p>
          </div>
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