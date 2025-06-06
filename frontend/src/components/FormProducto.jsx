import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';
import Loading from '../utilities/Loading';
import '../styles/loading.css';
import { PrivateRoutes } from '../models/routes';

function FormProductoModern() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [colorMessage, setColorMessage] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [producto, setProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_venta: '',
    imagenes: [],
    colores: [],
  });

  const [nuevoColor, setNuevoColor] = useState({ name: '', hex: '#000000' });


  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
        .then(response => response.json())
        .then(data => setProducto(data))
        .catch(error => console.error('Error al cargar el producto:', error));
    }
  }, [id]);

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  
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
      alert("Máximo 10 imágenes por producto.");
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
        setMessage(id ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
        setColorMessage('verde');
        setTimeout(() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, { replace: true }), 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        setMessage('Error al procesar el producto.');
        setColorMessage('rojo');
      });
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


      {message && (
        <div className={`alert ${colorMessage === 'verde' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="p-6 bg-background rounded-lg shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Columna izquierda */}
            <div className="md:w-1/2 space-y-4">
              {/* Imagen principal */}
              <img 
                src={
                  imagenSeleccionada ||
                  (imagenes.length > 0 ? URL.createObjectURL(imagenes[0]) : producto.imagenes[0]) ||
                  "https://placehold.co/600x600.png"
                }
                alt="Imagen del producto" 
                className="w-full h-auto rounded-lg shadow object-contain" 
              />

              {/* Miniaturas debajo de la principal */}
              <div className="flex flex-wrap justify-center gap-2">
              {/* Imágenes ya cargadas */}
              {producto.imagenes.map((url, index) => (
                <img 
                  key={`existente-${index}`}
                  src={url} 
                  alt={`img-${index}`} 
                  className="w-16 h-16 object-cover border rounded cursor-pointer hover:opacity-80 transition"
                  onClick={() => setImagenSeleccionada(url)}
                />
              ))}

              {/* Imágenes recién seleccionadas */}
              {imagenes.map((img, index) => {
                const previewUrl = URL.createObjectURL(img);
                return (
                  <img 
                    key={`nueva-${index}`}
                    src={previewUrl}
                    alt={`preview-${index}`} 
                    className="w-16 h-16 object-cover border rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => setImagenSeleccionada(previewUrl)}
                  />
                );
              })}
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
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                  >
                    <span className="text-3xl">+</span>
                    <span className="text-xs mt-1">Subir</span>
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
                        alert("Máximo 10 imágenes por producto.");
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
              // className="button-pretty w-full"
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
