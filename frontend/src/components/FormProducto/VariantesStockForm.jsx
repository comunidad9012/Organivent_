import React from "react";

function VariantesStockForm({ producto, setProducto }) {
  // Toggle es_stock
  const handleToggleStock = (e) => {
    setProducto(prev => ({
      ...prev,
      es_stock: e.target.checked,
      variantes: e.target.checked ? prev.variantes || [] : []
    }));
  };

  // Agregar variante vacía
  const addVariante = () => {
    setProducto(prev => ({
      ...prev,
      variantes: [...(prev.variantes || []), { atributos: { color: "" }, cantidad: 0 }]
    }));
  };

  // Cambiar atributo o cantidad
  const handleVarianteChange = (index, field, value) => {
    const nuevas = [...producto.variantes];
    if (field === "cantidad") {
      nuevas[index].cantidad = Number(value);
    } else {
      nuevas[index].atributos[field] = value;
    }
    setProducto(prev => ({ ...prev, variantes: nuevas }));
  };

  // Eliminar variante
  const removeVariante = (index) => {
    const nuevas = producto.variantes.filter((_, i) => i !== index);
    setProducto(prev => ({ ...prev, variantes: nuevas }));
  };

  return (
    <div className="infield mb-6 p-4 border rounded-lg bg-gray-50">
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={producto.es_stock || false}
          onChange={handleToggleStock}
        />
        Manejar stock
      </label>

      {producto.es_stock && (
        <div>
          <h3 className="font-bold mb-2">Variantes con stock</h3>
          {producto.variantes?.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
            {/* Color desde ColoresDisponibles */}
            <select
              value={v.atributos.color || ""}
              onChange={(e) => handleVarianteChange(i, "color", e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">-- Selecciona un color --</option>
              {producto.colores.map((c, idx) => (
                <option key={idx} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          
            {/* Tamaño libre */}
            <input
              type="text"
              placeholder="Tamaño (opcional)"
              value={v.atributos.tamaño || ""}
              onChange={(e) => handleVarianteChange(i, "tamaño", e.target.value)}
              className="border p-1 rounded"
            />
          
            {/* Stock */}
            <input
              type="number"
              placeholder="Cantidad"
              value={v.cantidad || ""}
              onChange={(e) => handleVarianteChange(i, "cantidad", e.target.value)}
              className="border p-1 rounded w-24"
            />
          
            <button
              type="button"
              onClick={() => removeVariante(i)}
              className="px-2 bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
          
          ))}
          <button
            type="button"
            onClick={addVariante}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            + Añadir variante
          </button>
        </div>
      )}
    </div>
  );
}

export default VariantesStockForm;
