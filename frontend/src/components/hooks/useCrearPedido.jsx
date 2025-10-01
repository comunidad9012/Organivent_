// hooks/useCrearPedido.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import { PrivateRoutes } from "../../models/routes";
import { toast } from "sonner";

function useCrearPedido() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { cart, dispatch } = useCart();
  const userState = useSelector((state) => state.user);

  const handleComprar = async (event) => {
    if (event) event.preventDefault();
    setLoading(true);

    console.log("🛒 Carrito antes de crear el pedido:", cart);

    // Armamos los productos con la variante plana
    const productosParaPedido = cart.map((p) => {
      const variantePlana = p.selectedVariante
        ? { ...p.selectedVariante.atributos } // color, tamaño, etc.
        : null;

      const precioFinal = p.precio_final || p.precio_venta;
      const cantidad = p.quantity || 1;

      return {
        productoId: p._id,
        productoNombre: p.nombre_producto,
        cantidad,
        variante: variantePlana, // <-- nueva estructura
        precio_original: p.precio_original || p.precio_venta,
        precio_final: precioFinal,
        precio_unitario: precioFinal,
        descuento_aplicado: p.descuento_aplicado || null,
        subtotal: precioFinal * cantidad,
        imagenes: p.imagenes || [],
      };
    });

    console.log("📦 Productos para enviar al pedido:", productosParaPedido);

    const data = {
      usuarioId: userState.id,
      cliente_nombre: userState.nombre_usuario,
      cliente_email: userState.email,
      productos: productosParaPedido,
      total: productosParaPedido.reduce((acc, item) => acc + item.subtotal, 0),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/Pedidos/createPedido",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al crear el pedido");

      const result = await response.json();
      console.log("📦 Respuesta del servidor al crear pedido:", result);

      if (result.mensaje === "Pedido creado exitosamente") {
        toast.success("¡Pedido creado con éxito!");
        dispatch({ type: "CLEAR_CART" });
        setTimeout(() =>
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.COMPRA_FINALIZADA}`,
            { replace: true }
          )
        );
      } else {
        toast.error("Error al crear el pedido");
        console.error(
          "Error al crear el pedido: " +
            (result.error || "Respuesta inesperada")
        );
      }
    } catch (err) {
      console.error("Error al crear el pedido:", err);
      toast.error("Error al crear el pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleComprar, loading };
}

export default useCrearPedido;
