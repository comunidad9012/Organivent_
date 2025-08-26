import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";

function FavButton({ productId }) {
  const [favorito, setFavorito] = useState(false);
  const userState = useSelector(state => state.user);

  const userId = userState?.id;

  useEffect(() => {
    const checkFavorito = async () => {
      try {
        const res = await fetch(`http://localhost:5000/Productos/es_favorito/${productId}?user_id=${userId}`);
        const data = await res.json();
        setFavorito(data.isFavorito);
      } catch (err) {
        console.error("Error al verificar favorito:", err);
      }
    };

    if (userId) checkFavorito();
  }, [productId, userId]);

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:5000/Productos/toggle_favorito/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      setFavorito(data.isFavorito);
    } catch (err) {
      console.error("Error al marcar favorito:", err);
    }
  };

  return (
    <button
      onClick={toggleFavorito}
      className="absolute top-2 right-2 z-10"
      aria-label="Agregar a favoritos"
    >
      <Heart
        size={22}
        className={favorito ? "fill-red-500 stroke-red-500" : "stroke-gray-500"}
      />
    </button>
  );
}

export default FavButton;
