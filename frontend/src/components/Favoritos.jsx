import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import Precio from "../utilities/Precio";
import FavButton from "./FavButton";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!userState?.id) return;
      try {
        const response = await fetch(
          `http://localhost:5000/Productos/favoritos/${userState.id}`
        );
        const data = await response.json();
        setFavoritos(data);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [userState]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Tus favoritos ❤️</h2>
      {favoritos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {favoritos.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="relative aspect-square bg-white overflow-hidden group">
                {/* Botón de favorito */}
                <FavButton productId={product._id} />

                {/* Colores disponibles */}
                {product.colores?.length > 0 && (
                  <p className="absolute top-2 left-2 z-10 text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-600">
                    {product.colores.length} colores!
                  </p>
                )}

                {/* Imagen clickeable */}
                <Link
                  to={`/Productos/viewproduct/${product._id}`}
                  className="block relative z-0"
                >
                  <img
                    src={
                      product.imagenes?.[0] ||
                      "http://localhost:5000/imgs/imagenes/default.jpg"
                    }
                    alt={product.nombre_producto}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <Link to={`/Productos/viewproduct/${product._id}`} className="block">
                <div className="p-3 space-y-2 text-center bg-gray-50">
                  <Precio
                    valor={Number(product.precio_venta)}
                    className="text-black font-bold text-lg"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors">
                    {product.nombre_producto}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            Todavía no tienes productos favoritos
          </h3>
          <p className="text-gray-500">
            Explora la tienda y guarda los que más te gusten.
          </p>
        </div>
      )}
    </div>
  );
}

export default Favoritos;

