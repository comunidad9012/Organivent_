// GaleriaProducto.jsx
import ImagenPrincipal from "./ImagenPrincipal";
import ThumbnailCarousel from "./ThumbnailCarousel";

export default function GaleriaProducto({
  imagenSeleccionada,
  setImagenSeleccionada,
  imagenes,
  producto,
  getAllImages,
  currentThumbnailIndex,
  prevThumbnails,
  nextThumbnails,
}) {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-6">
        <ImagenPrincipal
          imagenSeleccionada={imagenSeleccionada}
          imagenes={imagenes}
          producto={producto}
        />

        <ThumbnailCarousel
          imagenSeleccionada={imagenSeleccionada}
          setImagenSeleccionada={setImagenSeleccionada}
          getAllImages={getAllImages}
          currentThumbnailIndex={currentThumbnailIndex}
          prevThumbnails={prevThumbnails}
          nextThumbnails={nextThumbnails}
        />
      </div>
    </div>
  );
}
