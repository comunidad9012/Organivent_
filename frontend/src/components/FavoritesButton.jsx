import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { PrivateRoutes } from "../models/routes";

function FavoritesButton() {
  return (
    <Link to={`/private/user/${PrivateRoutes.FAVORITES}`}>
      <button
        className="relative flex p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Favoritos"
      >
        <Heart className="w-6 h-6 text-gray-600" />
      </button>
    </Link>
  );
}

export default FavoritesButton;
