// hooks/useCrearPedido.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import store from "../../redux/store";
import { useSelector } from "react-redux";
import { PrivateRoutes } from "../../models/routes";

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
        nombre: p.nombre_producto,
        cantidad: p.quantity || 1,
        color: p.selectedColor || null,

        // Foto histórica de precios y descuento
        precio_original: p.precio_original || p.precio_venta,
        precio_final: p.precio_final || p.precio_venta,
        descuento_aplicado: p.descuento_aplicado || null,

        // También dejamos precio_unitario/subtotal por compatibilidad
        precio_unitario: p.precio_final || p.precio_venta,
        subtotal: (p.precio_final || p.precio_venta) * (p.quantity || 1),
        imagenes: p.imagenes || []
      })),
      total: cart.reduce((acc, item) => {
        const precio = item.precio_final || item.precio_venta;
        return acc + precio * (item.quantity || 1);
      }, 0),
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
        setTimeout(() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, { replace: true }), 2000); // o a una página de confirmación
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
