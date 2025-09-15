// NombreProducto.jsx
import React from "react";

export default function NombreProducto({ producto, handleChange }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Nombre del Producto
        </h4>
      </div>

      <div className="relative">
        <input 
          required
          type="text" 
          name="nombre_producto" 
          value={producto.nombre_producto || ""}
          onChange={handleChange}
          placeholder="Ingresa el nombre del producto"
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg bg-white bg-opacity-95 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base font-medium"
        />
      </div>

      <div className="mt-2 text-xs text-gray-500">
        El nombre aparecerá en el catálogo y búsquedas
      </div>
    </div>
  );
}