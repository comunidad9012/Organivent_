import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Loading from '../utilities/Loading';
import '../styles/loading.css';
import { PrivateRoutes } from '../models/routes';
import { toast } from 'sonner';

function FormProductoModern() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [producto, setProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_venta: '',
    imagenes: [],
    colores: [],
    categoria: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ 
    nombre_categoria: '', 
    descripcion: '', 
    subcategorias: [] 
  });
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = useState(false);
  const [nuevoColor, setNuevoColor] = useState({ name: '', hex: '#000000' });
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  // Obtener las categorías al cargar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Categoria/showCategorias");
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
        
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
        .then(response => response.json())
        .then(data => setProducto(data))
        .catch(error => console.error('Error al cargar el producto:', error));
    }
  }, [id]);

  
  // limpia los objetos URL generados con URL.createObjectURL
  useEffect(() => {
    return () => {
      imagenes.forEach(img => URL.revokeObjectURL(img));
    };
  }, [imagenes]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (descripcion) => {
    setProducto(prev => ({ ...prev, descripcion }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = files.length + producto.imagenes.length;
  
    if (total > 10) {
      toast.error("Máximo 10 imágenes por producto.");
      return;
    }
  
    setImagenes(files);
  };

  
  const subirImagenes = async () => {
    if (!imagenes || imagenes.length === 0) {
      console.warn("No hay imágenes para subir");
      return [];
    }

    const formData = new FormData();
    imagenes.forEach((img) => formData.append('file', img));

    try {
      const response = await fetch('http://localhost:5000/imgs/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Error al subir imágenes");
      }

      const data = await response.json();
      console.log("Respuesta del back:", data);
      return data.locations || [];

    } catch (error) {
      console.error("Error al subir imágenes:", error);
      return [];
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const nuevasUrls = await subirImagenes();
  
    const finalProducto = {
      ...producto,
      imagenes: [...(producto.imagenes || []), ...nuevasUrls]
    };
  
    const url = id
      ? `http://localhost:5000/Productos/update/${id}`
      : 'http://localhost:5000/Productos/createProductos';
  
    const method = id ? 'PUT' : 'POST';
  
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProducto)
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        toast.success(id ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
        setTimeout(() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, { replace: true }), 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        toast.error(id ? 'Error al actualizar el producto.' : 'Error al crear el producto.');
      });
  };

  // Función para obtener todas las imágenes (existentes + nuevas)
  const getAllImages = () => {
    const existingImages = producto.imagenes.map(url => ({ type: 'existing', url, original: url }));
    const newImages = imagenes.map(img => ({ type: 'new', url: URL.createObjectURL(img), original: img }));
    return [...existingImages, ...newImages];
  };

  // Funciones para navegar en el carrusel
  const nextThumbnails = () => {
    const allImages = getAllImages();
    const maxIndex = Math.max(0, allImages.length - 3);
    setCurrentThumbnailIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevThumbnails = () => {
    setCurrentThumbnailIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <Helmet>
        <title>{id ? 'Editar Producto' : 'Añadir Producto'}</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-center my-5">
        {id ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>



      {loading && <Loading/>}

      <form onSubmit={handleSubmit}>
        <div className="p-4 bg-background rounded-lg shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Columna izquierda */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="space-y-6">
                
                {/* Imagen principal con marco elegante */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <img 
                    src={
                      imagenSeleccionada ||
                      (imagenes.length > 0 ? URL.createObjectURL(imagenes[0]) : producto.imagenes[0]) ||
                      "https://placehold.co/600x600/f8fafc/64748b?text=Imagen+Principal"
                    }
                    alt="Imagen del producto" 
                    className="w-[500px] h-[500px] relative w-full aspect-square object-cover rounded-2xl shadow-xl border-4 border-white" 
                  />
                </div>

                {/* Carrusel de miniaturas mejorado */}
                <div className="relative">
                  {(() => {
                    const allImages = getAllImages();
                    const showCarousel = allImages.length > 4;
                    const visibleImages = showCarousel 
                      ? allImages.slice(currentThumbnailIndex, currentThumbnailIndex + 4)
                      : allImages;

                    return (
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

                          {/* Miniaturas visibles */}
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
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="md:w-1/2 md:pl-6 space-y-6">
              {/* Nombre producto */}
              <div className="infield mb-6">
                <input 
                  required
                  type="text" 
                  name="nombre_producto" 
                  value={producto.nombre_producto}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                />
                <label></label>
              </div>

              {/* Carga de imagenes */}
              <div className="infield bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">
                  {`Fotos · ${producto.imagenes.length + imagenes.length}/10 — Máximo de 10 fotos.`}
                </p>
            
                <div className="flex flex-wrap gap-2 items-start">
                  {/* Miniaturas de imágenes ya cargadas */}
                  {producto.imagenes.map((url, index) => (
                    <div key={`cargada-${index}`} className="relative w-24 h-24">
                      <img 
                        key={`existente-${index}`}
                        src={url} 
                        alt={`img-${index}`} 
                        className="w-full h-full object-cover rounded"
                        onClick={() => setImagenSeleccionada(url)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProducto(prev => ({
                            ...prev,
                            imagenes: prev.imagenes.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                    
                  {/* Miniaturas de imágenes recién seleccionadas */}
                  {imagenes.map((img, index) => {
                    const previewUrl = URL.createObjectURL(img);
                    return (
                      <div key={`nueva-${index}`} className="relative w-24 h-24">
                        <img 
                          key={`nueva-${index}`}
                          src={previewUrl}
                          alt={`preview-${index}`} 
                          className="w-full h-full object-cover rounded"
                          onClick={() => setImagenSeleccionada(previewUrl)}
                        />
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
                    );
                  })}

                  {/* Botón añadir imagenes */}
                  <button
                    type="button"
                    onClick={() => document.getElementById('input-fotos').click()}
                    className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 group hover:scale-105"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-xs font-medium">Subir</span>
                  </button>
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

              {/* Precio */}
              <div className="infield mb-6">
                <input 
                  required
                  type="number" 
                  name="precio_venta" 
                  value={producto.precio_venta}
                  onChange={handleChange}
                  placeholder="Precio de venta"
                />
                <label></label>
              </div>

              {/* Añadir colores disponibles */}
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

                {/* Mostrar colores añadidos */}
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

            </div>
          </div>

          {/* Sección Categoria */}
          <div className="infield mb-6 bg-gray-100 p-4 rounded-lg">
            <div className="flex gap-2">
              <select 
                className="w-full p-2 border rounded"
                value={producto.categoria || ''}
                onChange={(e) => setProducto(prev => ({ ...prev, categoria: e.target.value }))}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat.nombre_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
              {/* Agregar categoria */}
              <button 
                type="button" 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => setMostrarFormularioCategoria(true)}
              >
                +
              </button>
            </div>

            {/* Crear categoria */}
            {mostrarFormularioCategoria && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-bold mb-3">Nueva Categoría</h4>
                
                <div className="grid gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="p-2 border rounded"
                    value={nuevaCategoria.nombre_categoria}
                    onChange={(e) => setNuevaCategoria(prev => ({ ...prev, nombre_categoria: e.target.value }))}
                  />
                  
                  <input
                    type="text"
                    placeholder="Descripción"
                    className="p-2 border rounded"
                    value={nuevaCategoria.descripcion}
                    onChange={(e) => setNuevaCategoria(prev => ({ ...prev, descripcion: e.target.value }))}
                  />
                  
                  <input
                    type="text"
                    placeholder="Subcategorías (separadas por coma)"
                    className="p-2 border rounded"
                    onChange={(e) =>
                      setNuevaCategoria(prev => ({ 
                        ...prev, 
                        subcategorias: e.target.value.split(",").map(s => s.trim()) 
                      }))
                    }
                  />
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={async () => {
                        try {
                          await axios.post("http://localhost:5000/Categoria/createCategoria", nuevaCategoria);
                          setMostrarFormularioCategoria(false);
                          setNuevaCategoria({ nombre_categoria: '', descripcion: '', subcategorias: [] });
                          
                          // Actualizar lista de categorías
                          const res = await axios.get("http://localhost:5000/Categoria/showCategorias");
                          setCategorias(res.data);
                          toast.success("Categoría creada exitosamente");
                        } catch (err) {
                          console.error("Error al crear categoría:", err);
                          toast.error("Error al crear la categoría");
                        }
                      }}
                    >
                      Guardar categoría
                    </button>
                    
                    <button 
                      type="button"
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      onClick={() => setMostrarFormularioCategoria(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-2">
            <p className="block m-2 font-bold">Descripción:</p>
            <Editor
              apiKey='1hyldt9u4byda8tjkhrxwy3zqocdzt2fujo24fy4spgi9wmc'
              onInit={(evt, editor) => editorRef.current = editor}
              init={{ height: 300, menubar: true, language: 'es' }}
              onEditorChange={handleEditorChange}
              value={producto.descripcion}
            />
          </div>
          {/* Botón de carga de producto */}
          <button 
            type="submit" 
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Cargando...' : id ? 'Actualizar producto' : 'Cargar producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormProductoModern;
