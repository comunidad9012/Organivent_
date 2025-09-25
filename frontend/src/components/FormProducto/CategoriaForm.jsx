// CategoriaForm.jsx
import axios from "axios";
import { toast } from "sonner";

export default function CategoriaForm({
  producto,
  setProducto,
  categorias,
  setCategorias,
  mostrarFormularioCategoria,
  setMostrarFormularioCategoria,
  nuevaCategoria,
  setNuevaCategoria,
}) {
  return (
    <div className="infield mb-6 bg-gray-100 p-4 rounded-lg">
      <div className="flex gap-2">
        <select 
          required
          className="w-full p-2 border rounded"
          value={producto.categoria || ''}
          onChange={(e) => setProducto(prev => ({ ...prev, categoria: e.target.value }))}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>

        {/* Agregar categoría */}
        <button 
          type="button" 
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => setMostrarFormularioCategoria(true)}
        >
          +
        </button>
      </div>

      {/* Formulario nueva categoría */}
      {mostrarFormularioCategoria && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-bold mb-3">Nueva Categoría</h4>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Nombre"
              className="p-2 border rounded"
              value={nuevaCategoria.nombre_categoria}
              onChange={(e) => setNuevaCategoria(prev => ({ ...prev, nombre_categoria: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Descripción"
              className="p-2 border rounded"
              value={nuevaCategoria.descripcion}
              onChange={(e) => setNuevaCategoria(prev => ({ ...prev, descripcion: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Subcategorías (separadas por coma)"
              className="p-2 border rounded"
              onChange={(e) =>
                setNuevaCategoria(prev => ({ 
                  ...prev, 
                  subcategorias: e.target.value.split(",").map(s => s.trim()) 
                }))
              }
            />

            <div className="flex gap-2">
              <button
                type="button"
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={async () => {
                  try {
                    await axios.post("http://localhost:5000/Categoria/createCategoria", nuevaCategoria);
                    setMostrarFormularioCategoria(false);
                    setNuevaCategoria({ nombre_categoria: '', descripcion: '', subcategorias: [] });

                    // Actualizar lista de categorías
                    const res = await axios.get("http://localhost:5000/Categoria/showCategorias");
                    setCategorias(res.data);
                    toast.success("Categoría creada exitosamente");
                  } catch (err) {
                    console.error("Error al crear categoría:", err);
                    toast.error("Error al crear la categoría");
                  }
                }}
              >
                Guardar categoría
              </button>

              <button 
                type="button"
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setMostrarFormularioCategoria(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
