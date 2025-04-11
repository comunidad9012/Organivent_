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

function Productos() {
  const [Productos, setProductos] = useState([]); // Lista de productos
  const [message, setMessage] = useState(""); // Mensaje de éxito o error
  const [colorMessage, setColorMessage] = useState('');
  
  const { filters } = useContext(FiltersContext) //consumo el contexto de los filtros
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no


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

      <div className="container text-center">
      <h1>Productos</h1>

        {/* Muestra un mensaje de éxito o error */}
        {message && <div className={`alert ${colorMessage === 'verde' ? 'alert-success' : colorMessage === "rojo" ? 'alert-danger' : 'alert-info'}`}>{message}</div>}


        {Productos.length > 0 ? (
          <div className="row mx-auto d-flex justify-content-center align-products-center mt-4">
            {Productos.map((product, index) => (
              <Fragment key={product._id}>
                <div className="col-md-4 mi-clase-css mt-4">
                  <div className="card h-100" style={{ width: "18rem" }}>
                    <img src={product.miniatura || "../../imagenes/foto.png"} className="card-img-top" alt="..." />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.nombre_producto}</h5>
                      <p className="card-text">${product.precio_venta}</p>
                      <Link to={`/Productos/viewproduct/${product._id}`} className="mt-auto">Ver más</Link>
                      <br />


                      {userState.rol === Roles.ADMIN ?
                        <>
                          {/* <Link to={`/Productos/edit/${product._id}`} className="btn btn-warning mt-2"> */}
                          <Link to={`/private/${PrivateRoutes.EDIT_PRODUCT}/${product._id}`} className="btn btn-warning mt-2">
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
    </div>
  );
}

export default Productos;
