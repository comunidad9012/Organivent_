// ImagenPrincipal.jsx
export default function ImagenPrincipal({ imagenSeleccionada, imagenes, producto }) {
  const imagenSrc =
    imagenSeleccionada ||
    (imagenes.length > 0
      ? URL.createObjectURL(imagenes[0])
      : producto.imagenes[0]?.url) || 
    "https://placehold.co/600x600/f8fafc/64748b?text=Imagen+Principal";
  
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <img
          src={imagenSrc}
          alt="Imagen del producto"
          className="w-[500px] h-[500px] relative w-full aspect-square object-cover rounded-2xl shadow-xl border-4 border-white"
        />
      </div>
    );
  }
  