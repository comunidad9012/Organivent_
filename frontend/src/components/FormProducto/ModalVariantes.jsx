import React, { useEffect } from "react";
import axios from "axios";

function ModalVariantes({ producto, setProducto, onClose }) {
  // Cerrar con Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = (e) => e.stopPropagation();

  const handleVarianteChange = (index, field, value) => {
    const nuevas = [...(producto.variantes || [])];
    if (field === "cantidad") nuevas[index].cantidad = Number(value);
    else nuevas[index].atributos[field] = value;
    setProducto((prev) => ({ ...prev, variantes: nuevas }));
  };

  const addVariante = () => {
    setProducto((prev) => ({
      ...prev,
      variantes: [
        ...(prev.variantes || []),
        { atributos: { color: "" }, cantidad: 0 },
      ],
    }));
  };

  const removeVariante = (index) => {
    const nuevas = (producto.variantes || []).filter((_, i) => i !== index);
    setProducto((prev) => ({ ...prev, variantes: nuevas }));
  };

  const handleGuardarYCerrar = () => {
    setProducto((prev) => ({ ...prev, es_stock: true }));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-auto transform transition-all duration-200 scale-100"
        onClick={stop}
      >
        <div className="p-4 border-b bg-white bg-opacity-90 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gestionar variantes</h3>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-gray-100 hover:bg-opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="p-4 bg-white bg-opacity-90">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 bg-opacity-70">
                <th className="p-2 border">Color</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(producto.variantes || []).map((v, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 hover:bg-opacity-50"
                >
                  <td className="p-2">
                    <select
                      value={v.atributos.color || ""}
                      onChange={(e) =>
                        handleVarianteChange(i, "color", e.target.value)
                      }
                      className="border p-1 rounded w-full bg-white bg-opacity-90"
                    >
                      <option value="">-- Seleccionar color --</option>
                      {(producto.colores || []).map((c, idx) => (
                        <option key={idx} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={v.cantidad ?? ""}
                      onChange={(e) =>
                        handleVarianteChange(i, "cantidad", e.target.value)
                      }
                      className="border p-1 rounded w-28 bg-white bg-opacity-90"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeVariante(i)}
                      className="px-2 py-1 bg-red-500 bg-opacity-90 text-white rounded hover:bg-opacity-100"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {(!producto.variantes || producto.variantes.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No hay variantes. Añade una.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={addVariante}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 bg-opacity-90 text-white rounded-lg hover:from-green-600 hover:to-green-700 hover:bg-opacity-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-lg">+</span>
              Añadir variante
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGuardarYCerrar}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 bg-opacity-90 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 hover:bg-opacity-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Guardar y cerrar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 bg-opacity-90 text-gray-700 rounded-lg hover:bg-gray-400 hover:bg-opacity-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalVariantes;
