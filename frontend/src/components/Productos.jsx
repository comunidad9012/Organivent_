import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles.js";
import FavButton from "./FavButton";
import { ShoppingCart, SquarePen } from "lucide-react";
import { FiltersContext } from "./context/filters.jsx";
import Paginacion from "./Paginacion.jsx";
import PriceWhitDiscountOrNot from "../utilities/PriceWhitDiscountOrNot.jsx";
import DeleteItem from "../utilities/DeleteItem";
import { useNavigate } from "react-router-dom";

function Productos() {
  const [productos, setProductos] = useState([]);

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { filters, setFilters } = useContext(FiltersContext);
  const userState = useSelector((store) => store.user);

  useEffect(() => {
  const fetchProductos = async () => {
    try {
      let url;
      let data;

      if (filters.query.trim() !== "") {
        const response = await fetch("http://localhost:5000/Productos/find_product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ palabra: filters.query }),
        });
        data = await response.json();
      } else if (filters.id_categoria) {
        url = `http://localhost:5000/Productos/showProductosPorCategoria/${filters.id_categoria}`;
        const response = await fetch(url);
        data = await response.json();
      } else {
        url = "http://localhost:5000/Productos/showProductos";
        const response = await fetch(url);
        data = await response.json();
      }

      setProductos(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  fetchProductos();
}, [filters.query, filters.id_categoria]);

  // paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productos.slice(startIndex, endIndex);

  //un stopPropagation para que no navegue al detalle del producto cuando clickeo en los botones de editar o borrar
  const navigate = useNavigate();
  function handleCardNav(e, id) {
    // Si el evento ya fue prevenido por otro handler
    if (e.defaultPrevented) return;

    // Si el click ocurrió dentro de un link, button o elemento con data-no-nav -> no navegues
    const targetEl = e.target instanceof Element ? e.target : null;
    if (targetEl && targetEl.closest("a, button, [data-no-nav]")) return;

    navigate(`/Productos/viewproduct/${id}`);
  }

  function handleCardKey(e, id) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/Productos/viewproduct/${id}`);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Productos</h1>
        {/* Zona principal */}
        
          <div className="max-w-3xl mx-auto px-2 py-6">
            {productos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleCardNav(e, product._id)}
                    onKeyDown={(e) => handleCardKey(e, product._id)}
                  >
                    <div className="relative aspect-square bg-white overflow-hidden group">
                      {/* Botón favorito - asegura que no navegue si es clickeado */}
                      <FavButton productId={product._id} data-no-nav />

                      {product.colores?.length > 0 && (
                        <p className="absolute top-2 left-2 z-10 text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-600">
                          {product.colores.length} colores!
                        </p>
                      )}

                      {/* Imagen (no hace falta link) */}
                      <img
                        src={product.imagenes?.[0]?.url || "http://localhost:5000/imgs/imagenes/default.jpg"}
                        alt={product.nombre_producto}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        // si por algún motivo querés asegurar que no burbujee:
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Contenido clickeable */}
                    <div className="block flex-1 flex flex-col p-3 bg-gray-50">
                      <PriceWhitDiscountOrNot product={product} />

                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors min-h-[2.5rem]">
                        {product.nombre_producto}
                      </h3>

                      {/* Admin Actions */}
                      {userState.rol === Roles.ADMIN && (
                        <div className="mt-auto flex justify-end gap-2">
                          {/* Editar: es un link pero marcado para no disparar la navegación del card */}
                          <Link
                            to={`/private/admin/Productos/update/${product._id}`}
                            onClick={(e) => e.stopPropagation()}
                            data-no-nav
                            className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow"
                          >
                            <SquarePen size={18} />
                          </Link>

                          {/* DeleteItem: asegurate que el botón interno tenga data-no-nav o stopPropagation */}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart
                  size={96}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar tus filtros o vuelve más tarde.
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          <Paginacion
            totalItems={productos.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
    </>
  );
}

export default Productos;
