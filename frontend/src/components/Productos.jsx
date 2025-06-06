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

function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  const [message, setMessage] = useState(""); // Mensaje de éxito o error
  const [colorMessage, setColorMessage] = useState('');
  
  const { filters } = useContext(FiltersContext) //consumo el contexto de los filtros
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const startIndex = (currentPage - 1) * itemsPerPage; //para definir el comienzo dice donde esta el anterior, lo multiplica por la cantidad de items por pagina para determinar desde que producto empezar a mostrar
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = Productos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(Productos.length / itemsPerPage);



  //const [loading, setLoading] = useState(false); // Para mostrar un spinner mientras se cargan los productos


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
    <div>
      <Helmet>
        <title>Productos</title>
      </Helmet>

      <div className="text-center">
      <h1>Productos</h1>

        {/* Muestra un mensaje de éxito o error */}
        {message && <div className={`alert ${colorMessage === 'verde' ? 'alert-success' : colorMessage === "rojo" ? 'alert-danger' : 'alert-info'}`}>{message}</div>}


        {Productos.length > 0 ? (
          // aca puedo poner justify-content-around para que los productos se distribuyan mejor y no en el centro
          <div className="row justify-content-center mt-4">
            
            {currentProducts.map((product, index) => (
              <Fragment key={product._id}>
                <div className="col-md-3 mt-4">
                  <div className="card h-100">
                  <img
                    src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
                    alt={product.nombre_producto}
                    className="card-img-top"
                  />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.nombre_producto}</h5>
                      {/* <div dangerouslySetInnerHTML={{ __html: product.descripcion }} /> */}
                      <p>{limitText(product.descripcion, 100)}</p>
                      <p className="card-text mt-auto">${product.precio_venta}</p>
                      {userState.rol === null ?
                      <Link to={`/Productos/viewproduct/${product._id}`} className="mt-auto">Ver más</Link>
                      : 
                      <Link to={`Productos/viewproduct/${product._id}`} className="mt-auto">Ver más</Link>
                      }
                      <br />


                      {userState.rol === Roles.ADMIN ?
                        <>
                          {/* <Link to={`/Productos/update/${product._id}`} className="btn btn-warning mt-2"> */}
                          <Link to={`/private/admin/Productos/update/${product._id}`} className="btn btn-warning mt-2">
                          {/* aca se arregló la direccion de la ruta para actualizar productos desde private/admin*/}
                          Editar
                          </Link>
                          <DeleteProduct product={product} setColorMessage={setColorMessage} setProductos={setProductos} setMessage={setMessage}/>
                        </>
                        :
                        <>
                          <CartProduct product={product}/>
                        </>
                    }



                    </div>
                  </div>
                </div>
                {index % 3 === 2 && <div className="w-100"></div>}
              </Fragment>
            ))}
          </div>
           ) : (
            <p>No hay productos disponibles.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="mt-4">
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
  );
}

export default Productos;
