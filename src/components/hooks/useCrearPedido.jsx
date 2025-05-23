// hooks/useCrearPedido.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import store from "../../redux/store";
import { useSelector } from "react-redux";

function useCrearPedido() {
  const [loading, setLoading] = useState(false);
  const [messagePedido, setMessagePedido] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { cart, dispatch } = useCart();
  const userState = useSelector(state => state.user); //consumo el estado de redux para saber si el usuario es admin o no

  const handleComprar = async (event) => {
    if (event) event.preventDefault(); // si se llama desde un formulario
    setLoading(true);
    setError(null);

    const data = {
      usuarioId: userState.id,
      productos: cart.map(p => ({
        productoId: p._id,
        cantidad: p.quantity || 1,
        color: p.selectedColor || null,
      })),
      total: cart.reduce((acc, item) => acc + item.precio_venta * (item.quantity || 1), 0),
    };

    try {
      const response = await fetch("http://localhost:5000/Pedidos/createPedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al crear el pedido");

      const result = await response.json();

      if (result.mensaje === "Pedido creado exitosamente") {
        setMessagePedido("¡Pedido creado con éxito!");
        dispatch({ type: "CLEAR_CART" });
        setTimeout(() => navigate("/"), 2000); // o a una página de confirmación
      } else {
        setMessagePedido("Error al crear el pedido: " + (result.error || "Respuesta inesperada"));
      }

    } catch (err) {
      console.error("Error al crear el pedido:", err);
      setError(err.message);
      setMessagePedido("Error en la solicitud: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleComprar, loading, messagePedido, error };
}

export default useCrearPedido;
