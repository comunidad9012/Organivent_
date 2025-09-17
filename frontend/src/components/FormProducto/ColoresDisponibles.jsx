// ColoresDisponibles.jsx
export default function ColoresDisponibles({ producto, setProducto, nuevoColor, setNuevoColor }) {
  const coloresCount = (producto.colores || []).length;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Colores Disponibles
        </h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          coloresCount > 0
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {coloresCount} color{coloresCount !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Formulario para añadir color */}
      <div className="mb-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="flex-[2]">
            <input
              type="text"
              placeholder="Nombre del color"
              value={nuevoColor.name || ''}
              onChange={(e) => setNuevoColor(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white bg-opacity-95 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex-[1]">
            <input
              type="color"
              value={nuevoColor.hex || '#000000'}
              onChange={(e) => setNuevoColor(prev => ({ ...prev, hex: e.target.value }))}
              className="w-12 h-10 p-1 border border-gray-300 rounded-lg bg-white cursor-pointer hover:shadow-md transition-all duration-200"
              title="Seleccionar color"
            />
          </div>
          
          <button
            type="button"
            onClick={() => {
              if (nuevoColor.name && nuevoColor.hex) {
                setProducto(prev => ({
                  ...prev,
                  colores: [...(prev.colores || []), nuevoColor]
                }));
                setNuevoColor({ name: '', hex: '#000000' });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!nuevoColor.name || !nuevoColor.hex}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir
          </button>
        </div>
      </div>

      {/* Mostrar colores existentes */}
      {coloresCount > 0 ? (
        <div className="flex gap-2 flex-wrap">
          {(producto.colores || []).map((color, index) => (
            <div 
              key={index} 
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} - ${color.hex}`}
              />
              <span className="text-sm font-medium text-gray-700">{color.name}</span>
              <button
                type="button"
                onClick={() => {
                  setProducto(prev => ({
                    ...prev,
                    colores: (prev.colores || []).filter((_, i) => i !== index)
                  }));
                }}
                className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-all duration-200"
                title="Eliminar color"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-gray-400 text-xs">Añade un color para crear variantes</p>
        </div>
      )}
    </div>
  );
}