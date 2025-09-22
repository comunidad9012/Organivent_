// GaleriaImagenesForm.jsx
import { toast } from "sonner";

export default function GaleriaImagenesForm({ producto, imagenes, setImagenes, setProducto, setImagenSeleccionada }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Galería de Imágenes
        </h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          producto.imagenes.length + imagenes.length >= 10 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {producto.imagenes.length + imagenes.length}/10
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3 items-start">
        {/* Imágenes cargadas */}
        {producto.imagenes.map((img, index) => (
          <div key={`cargada-${index}`} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={img.url}   // 👈 usar la propiedad url
                alt={`img-${index}`} 
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setImagenSeleccionada(img.url)} // 👈 idem
              />
              ...
            </div>
          </div>
        ))}

        {/* Imágenes nuevas */}
        {imagenes.map((img, index) => {
          const previewUrl = URL.createObjectURL(img);
          return (
            <div key={`nueva-${index}`} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-green-200">
                <img 
                  src={previewUrl}
                  alt={`preview-${index}`} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setImagenSeleccionada(previewUrl)}
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow z-10">
                  Nueva
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                <button
                  type="button"
                  onClick={() => {
                    setImagenes(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded-full shadow hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Botón agregar */}
        {(producto.imagenes.length + imagenes.length) < 10 && (
          <div className="aspect-square">
            <button
              type="button"
              onClick={() => document.getElementById('input-fotos').click()}
              className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-white/50 hover:border-indigo-400 transition-all duration-300 group hover:scale-105 bg-white/20"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs font-medium text-center">Agregar<br/>Fotos</span>
              </div>
            </button>
          </div>
        )}

        <input
          id="input-fotos"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const total = files.length + producto.imagenes.length + imagenes.length;
            if (total > 10) {
              toast.error("Máximo 10 imágenes por producto.");
              return;
            }
            setImagenes(prev => [...prev, ...files]);
          }}
        />     
      </div>
    </div>
  );
}
