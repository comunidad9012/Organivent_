import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import Precio from "../utilities/Precio";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const userState = useSelector(state => state.user);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!userState?._id) return;
      try {
        const response = await fetch(`http://localhost:5000/Productos/favoritos/${userState._id}`);
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
            <div key={product._id} className="bg-white rounded-lg shadow-md p-3">
              <Link to={`/Productos/viewproduct/${product._id}`}>
                <img
                  src={product.imagenes?.[0] || 'http://localhost:5000/imgs/imagenes/default.jpg'}
                  alt={product.nombre_producto}
                  className="w-full h-40 object-contain"
                />
                <h3 className="text-sm font-semibold mt-2">{product.nombre_producto}</h3>
                <Precio valor={Number(product.precio_venta)} className="text-lg font-bold text-gray-800"/>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-400 mb-4"/>
          <h3 className="text-lg font-medium text-gray-700">Todavía no tienes productos favoritos</h3>
          <p className="text-gray-500">Explora la tienda y guarda los que más te gusten.</p>
        </div>
      )}
    </div>
  );
}

export default Favoritos;

