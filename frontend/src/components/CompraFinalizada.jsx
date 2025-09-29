import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../models/routes";

export default function CompraFinalizada() {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.USER}`, { replace: true })
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 ¡Gracias por tu compra! 🎉
        </h1>
        <p className="text-gray-700 mb-8 pb-3">
          Tu pedido está siendo procesado. Te contactaremos por correo para coordinar el pago
        </p>
        <button
          onClick={handleVolver}
          className="button-pretty"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
