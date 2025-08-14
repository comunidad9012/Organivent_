import { useState, useEffect , Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useContext } from 'react'
import CartProduct from './CartProduct.jsx';
import DeleteProduct from './DeleteProduct.jsx';
import store from '../redux/store.js';
import { useSelector } from 'react-redux';
import { Roles } from '../models/roles.js';
import { PrivateRoutes } from '../models/routes.js';
import limitText from '../utilities/limitText.jsx';
import Precio from '../utilities/Precio.jsx';
import { FiltersContext } from './context/filters.jsx'

function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  
  const { filters, setFilters } = useContext(FiltersContext) //consumo el contexto de los filtros
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8 ;

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
      

      {Productos.length > 0 ? (
          // aca puedo poner justify-content-around para que los productos se distribuyan mejor y no en el centro
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {currentProducts.map(product => (
          <div key={product._id} className="card h-full">
            <img
              src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
              alt={product.nombre_producto}
              className="w-full h-60 object-contain mt-4"
               // style={{ backgroundColor: '#f9f9f9' }}
            />
            <div className="card-body flex flex-col">
              <h5 className="card-title">{product.nombre_producto}</h5>
              <p>{limitText(product.descripcion, 100)}</p>


              {userState.rol === null ?
                      <Link to={`/Productos/viewproduct/${product._id}`} className="mt-auto">Ver más</Link>
                      : 
                      <Link to={`Productos/viewproduct/${product._id}`} className="mt-auto">Ver más</Link> 
                      }
                      <br />

                      
              <Precio valor={Number(product.precio_venta)} className="mx-auto mb-4 text-blue-700"/>
              {userState.rol === Roles.ADMIN ? (
                <>
                 {/* <Link to={`/Productos/update/${product._id}`} className="btn btn-warning mt-2"> */}
                  <Link to={`/private/admin/Productos/update/${product._id}`} className="btn btn-warning mt-2">
                    Editar
                  </Link>
                  <DeleteProduct product={product} setProductos={setProductos}/>
                </>
              ) : (
                <CartProduct product={product}/>
              )}
            </div>
          </div>
        ))}
      </div>
      
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>

    {/* Paginación */}
    <div className="mt-4 text-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`btn mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
</div>

</>

  );
}

export default Productos;
