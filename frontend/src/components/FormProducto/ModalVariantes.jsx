import { useEffect } from "react";

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

  // const handleVarianteChange = (index, field, value) => {
  //   const nuevas = [...(producto.variantes || [])];
  //   nuevas[index].atributos[field] = { name: value }; // 👈 compatibilidad con formato opciones
  //   setProducto((prev) => ({ ...prev, variantes: nuevas }));
  // };

  const handleVarianteChange = (index, field, value) => {
    const nuevas = [...(producto.variantes || [])];

    // preservamos stock si ya existe
    const cantidadExistente = nuevas[index].cantidad || 0;

    nuevas[index].atributos = {
      ...nuevas[index].atributos,
      [field]: { name: value },
    };

    nuevas[index].cantidad = cantidadExistente;

    setProducto((prev) => ({ ...prev, variantes: nuevas }));
  };

  const addVariante = () => {
    setProducto((prev) => ({
      ...prev,
      variantes: [
        ...(prev.variantes || []),
        { atributos: {}, cantidad: 0 }, // 👈 genérico
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
          {producto.variantes?.length > 0 && (
            <table className="w-full border mt-4">
              <thead>
                <tr className="bg-gray-100">
                  {/* Mostrar el título de opción dinámicamente */}
                  <th className="px-4 py-2">{producto.opciones[0]?.nombre}</th>
                  <th className="px-4 py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {producto.variantes.map((variante, idx) => {
                  const key = Object.keys(variante.atributos)[0]; // ej: "tamaño"
                  const value = variante.atributos[key].name; // ej: "S"

                  return (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{value}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={variante.cantidad || 0}
                          min={0}
                          onChange={(e) => {
                            const nuevas = [...producto.variantes];
                            nuevas[idx].cantidad = parseInt(e.target.value, 10);
                            setProducto({ ...producto, variantes: nuevas });
                          }}
                          className="border rounded px-2 py-1 w-24"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

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
