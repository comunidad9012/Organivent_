// ThumbnailCarousel.jsx
export default function ThumbnailCarousel({
    imagenSeleccionada,
    setImagenSeleccionada,
    getAllImages,
    currentThumbnailIndex,
    prevThumbnails,
    nextThumbnails,
  }) {
    const allImages = getAllImages();
    const showCarousel = allImages.length > 4;
    const visibleImages = showCarousel
      ? allImages.slice(currentThumbnailIndex, currentThumbnailIndex + 4)
      : allImages;
  
    return (
      <div className="relative">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-2">
            {/* Botón anterior */}
            {showCarousel && (
              <button
                type="button"
                onClick={prevThumbnails}
                disabled={currentThumbnailIndex === 0}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-gray-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
  
            {/* Miniaturas */}
            <div className="flex gap-3 px-2">
              {visibleImages.map((image, index) => {
                const globalIndex = showCarousel ? currentThumbnailIndex + index : index;
                return (
                  <div key={`${image.type}-${globalIndex}`} className="relative group">
                    <img
                      src={image.url}
                      alt={`img-${globalIndex}`}
                      className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-3 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                        imagenSeleccionada === image.url
                          ? "border-indigo-500 shadow-lg shadow-indigo-200 scale-105"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => setImagenSeleccionada(image.url)}
                    />
                  </div>
                );
              })}
            </div>
  
            {/* Botón siguiente */}
            {showCarousel && (
              <button
                type="button"
                onClick={nextThumbnails}
                disabled={currentThumbnailIndex >= allImages.length - 4}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-gray-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  