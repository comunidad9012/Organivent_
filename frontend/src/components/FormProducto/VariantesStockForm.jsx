import { useState } from "react";
import ModalVariantes from "./ModalVariantes";

function VariantesStockForm({ producto, setProducto }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    e?.preventDefault?.();
    console.log("Abrir modal variantes");
    // activamos es_stock si no lo estaba (opcional)
    setProducto(prev => ({ ...prev, es_stock: true, variantes: prev.variantes || [] }));
    setIsOpen(true);
  };

  const variantesCount = (producto.variantes || []).length;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Variantes de Stock
        </h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          variantesCount > 0
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {variantesCount} variante{variantesCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Gestionar variantes
        </button>

        {variantesCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {producto.variantes.slice(0, 3).map((variante, index) => (
              <div key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200 text-xs">
                <span className="font-medium text-gray-700">{variante.atributos.color || 'Sin color'}</span>
                <span className="text-gray-500">({variante.cantidad || 0})</span>
              </div>
            ))}
            {variantesCount > 3 && (
              <div className="inline-flex items-center px-2 py-1 bg-white/40 backdrop-blur-sm rounded-lg border border-purple-200 text-xs text-gray-600">
                +{variantesCount - 3} más
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <ModalVariantes
          producto={producto}
          setProducto={setProducto}
          onClose={() => {
            console.log("Cerrar modal variantes");
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default VariantesStockForm;