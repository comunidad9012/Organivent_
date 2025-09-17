import React from "react";

function PrecioForm({ producto, setProducto }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          Precio de Venta
        </h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          producto.precio_venta && parseFloat(producto.precio_venta) > 0
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {producto.precio_venta && parseFloat(producto.precio_venta) > 0 
            ? `$${parseFloat(producto.precio_venta).toLocaleString()}` 
            : 'Sin precio'
          }
        </span>
      </div>

      <div className="relative">
        <input 
          required
          type="number"
          name="precio_venta" 
          value={producto.precio_venta || ""}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full pl-8 pr-16 py-3 border border-purple-300 rounded-lg bg-white bg-opacity-90 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base font-medium"
        />
      </div>
    </div>
  );
}

export default PrecioForm;
