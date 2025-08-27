// ColoresDisponibles.jsx
export default function ColoresDisponibles({ producto, setProducto, nuevoColor, setNuevoColor }) {
    return (
      <div className=" bg-gray-100 p-4 rounded-lg">
        <span className="block mb-2 ">Colores disponibles:</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nombre del color"
            value={nuevoColor.name || ''}
            onChange={(e) => setNuevoColor(prev => ({ ...prev, name: e.target.value }))}
            className="border p-1 rounded"
          />
          <input
            type="color"
            value={nuevoColor.hex || '#000000'}
            onChange={(e) => setNuevoColor(prev => ({ ...prev, hex: e.target.value }))}
            className="w-10 h-10 p-0 border rounded"
          />
          <button
            type="button"
            className="button-pretty"
            onClick={() => {
              if (nuevoColor.name && nuevoColor.hex) {
                setProducto(prev => ({
                  ...prev,
                  colores: [...prev.colores, nuevoColor]
                }));
                setNuevoColor({ name: '', hex: '#000000' });
              }
            }}
          >
            Añadir
          </button>
        </div>
  
        {/* Mostrar colores */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {producto.colores.map((color, index) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
              <span className="text-sm">{color.name}</span>
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() => {
                  setProducto(prev => ({
                    ...prev,
                    colores: prev.colores.filter((_, i) => i !== index)
                  }));
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  