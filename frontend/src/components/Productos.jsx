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
import { Eye, Edit, ShoppingCart } from 'lucide-react';

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
  }, [filters.id_categoria]); // 🔹 Se ejecuta cuando `categoria` cambia



  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Productos</title>
      </Helmet>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {Productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden block cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image + Info (linkeables) */}
                <Link 
                  to={`/Productos/viewproduct/${product._id}`}
                  className="block"
                >
                  <div className="relative aspect-square bg-white overflow-hidden">
                    <img
                      src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
                      alt={product.nombre_producto}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 space-y-3 text-center bg-gray-50">
                    <div className="order-1">
                      <Precio valor={Number(product.precio_venta)} className="text-black font-bold text-2xl"/>
                    </div>
                    <h3 className="order-2 font-semibold text-gray-900 text-lg line-clamp-2 leading-tight group-hover:text-black transition-colors">
                      {product.nombre_producto}
                    </h3>
                  </div>
                </Link>

                {/* Admin Actions */}
                {userState.rol === Roles.ADMIN && (
                  <div className="pt-2 flex space-x-2">
                    <Link
                      to={`/private/admin/Productos/update/${product._id}`}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit size={14} />
                      <span>Editar</span>
                    </Link>
                    <div className="flex-1">
                      <DeleteProduct product={product} setProductos={setProductos}/>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <ShoppingCart size={96} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros o vuelve más tarde.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-center items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {/* Page numbers */}
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

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
            
            {/* Page info */}
            <div className="text-center mt-2 text-xs text-gray-500">
              Página {currentPage} de {totalPages} • Mostrando {currentProducts.length} de {Productos.length} productos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;