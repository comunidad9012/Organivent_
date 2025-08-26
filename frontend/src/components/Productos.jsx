import { useState, useEffect , Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useContext } from 'react'
import { FiltersContext } from './context/filters.jsx'
import CartProduct from './CartProduct.jsx';
import DeleteProduct from './DeleteProduct.jsx';
import store from '../redux/store.js';
import { useSelector } from 'react-redux';
import { Roles } from '../models/roles.js';
import { PrivateRoutes } from '../models/routes.js';
import limitText from '../utilities/limitText.jsx';
import Precio from '../utilities/Precio.jsx';
import FavButton from "./FavButton";
import { Edit, ShoppingCart } from 'lucide-react';

function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  
  const { filters } = useContext(FiltersContext) //consumo el contexto de los filtros
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const startIndex = (currentPage - 1) * itemsPerPage; //para definir el comienzo dice donde esta el anterior, lo multiplica por la cantidad de items por pagina para determinar desde que producto empezar a mostrar
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = Productos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(Productos.length / itemsPerPage);



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
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, [filters.id_categoria]); // Se ejecuta cuando `categoria` cambia



  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Productos</title>
      </Helmet>

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
                <div className="p-3 space-y-2 text-center bg-gray-50">
                  <Precio valor={Number(product.precio_venta)} className="text-black font-bold text-lg"/>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors">
                    {product.nombre_producto}
                  </h3>
                </div>
              </Link>

                {/* Admin Actions */}
                {userState.rol === Roles.ADMIN && (
                  <div className="flex justify-center gap-1 p-2 border-t bg-gray-50">
                    <Link
                      to={`/private/admin/Productos/update/${product._id}`}
                      className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      <Edit size={12} />
                      Editar
                    </Link>
                    <DeleteProduct product={product} setProductos={setProductos}/>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;