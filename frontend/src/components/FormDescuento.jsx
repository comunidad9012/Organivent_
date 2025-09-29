import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PrivateRoutes } from "../models/routes";

const FormDescuento = ({ initialData = null, isEdit = false }) => {
  const { id } = useParams(); 
  const [tipo, setTipo] = useState("porcentaje");
  const [formData, setFormData] = useState({
    nombre: "",
    valor: "",
    productos: [],
    categorias: [],
  });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDescuento = async () => {
      if (id) {
        try {
          const res = await fetch(`http://localhost:5000/Descuentos/viewDiscount/${id}`);
          const data = await res.json();
          // console.log("Datos recibidos del descuento:", data);

          setFormData({
            nombre: data.nombre || "",
            valor: data.valor || "",
            productos: data.productos || [],
            categorias: data.categorias || [],
          });
          setTipo(data.tipo || "porcentaje");
        } catch (error) {
          console.error("❌ Error al cargar el descuento:", error);
        }
      }
    };
    fetchDescuento();
  }, [id]);


  // 🚀 Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch("http://localhost:5000/Productos/showProductos");
        setProductos(await resProd.json());

        const resCat = await fetch("http://localhost:5000/Categoria/showCategorias");
        setCategorias(await resCat.json());
      } catch (error) {
        console.error("❌ Error cargando productos/categorías:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleProducto = (id) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.includes(id)
        ? prev.productos.filter((p) => p !== id)
        : [...prev.productos, id],
    }));
  };

  const toggleCategoria = (id) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(id)
        ? prev.categorias.filter((c) => c !== id)
        : [...prev.categorias, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      nombre: formData.nombre,
      tipo,
      valor: parseFloat(formData.valor),
      productos: formData.productos,
      categorias: formData.categorias,
      activo: true,
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date("2025-12-31T23:59:59Z").toISOString(),
    };

    try {
      const url = isEdit
        ? `http://localhost:5000/Descuentos/update/${id}`
        : "http://localhost:5000/Descuentos/createDescuento";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(isEdit ? "¡Descuento actualizado!" : "¡Descuento creado!");
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}/${PrivateRoutes.DESCUENTOS}`, { replace: true });
      } else {
        toast.error(result.error || "Error al guardar el descuento");
      }
    } catch (error) {
      console.error("⚠️ Error en fetch:", error);
      toast.error("No se pudo conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-xl font-bold">
        {isEdit ? "Editar cupón" : "Nuevo cupón"}
      </h2>
      <p className="text-gray-600">Elige el tipo de cupón que deseas ofrecer:</p>

      {/* Botones de tipo */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTipo("monto")}
          className={`p-3 rounded-lg border font-medium ${
            tipo === "monto" ? "bg-red-500 text-white" : "bg-gray-100"
          }`}
        >
          💲 Monto fijo
        </button>
        <button
          type="button"
          onClick={() => setTipo("porcentaje")}
          className={`p-3 rounded-lg border font-medium ${
            tipo === "porcentaje" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          % Porcentaje
        </button>
      </div>

      {/* Campos */}
      <div>
        <p className="block font-medium mb-1">Nombre del cupón</p>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Ej. OFERTAVERANO"
          required
        />
      </div>

      <div>
        <p className="block font-medium mb-1">
          {tipo === "porcentaje" ? "Porcentaje de descuento (%)" : "Monto fijo ($)"}
        </p>
        <input
          type="number"
          name="valor"
          step="0.01"
          value={formData.valor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder={tipo === "porcentaje" ? "Ej. 20 (20%)" : "Ej. 500 (500 pesos)"}
          required
          min={tipo === "porcentaje" ? 1 : 1}
          max={tipo === "porcentaje" ? 99 : undefined}
        />
      </div>

      {/* Chips de productos */}
      <div>
        <p className="block font-medium mb-1">Aplicar a productos</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {productos.map((p) => (
            <button
              type="button"
              key={p._id}
              onClick={() => toggleProducto(p._id)}
              className={`px-3 py-1 rounded-full text-sm border ${
                formData.productos.includes(p._id)
                  ? "bg-blue-100 text-blue-800 border-blue-400"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {p.nombre_producto}
              {formData.productos.includes(p._id) && (
                <span className="ml-2">✕</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chips de categorías */}
      <div>
        <p className="block font-medium mb-1">Aplicar a categorías</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {categorias.map((c) => (
            <button
              type="button"
              key={c._id}
              onClick={() => toggleCategoria(c._id)}
              className={`px-3 py-1 rounded-full text-sm border ${
                formData.categorias.includes(c._id)
                  ? "bg-green-100 text-green-800 border-green-400"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {c.nombre_categoria}
              {formData.categorias.includes(c._id) && (
                <span className="ml-2">✕</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isEdit ? "Actualizar cupón" : "Crear cupón"}
      </button>
    </form>
  );
};

export default FormDescuento;