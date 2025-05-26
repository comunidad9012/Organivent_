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
    imagenes_urls: [],// array para imagenes
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (descripcion) => {
    setProducto(prev => ({ ...prev, descripcion }));
  };

  const handleImageUpload = (e) => {
    setImagenes(Array.from(e.target.files));
  };

  
  const subirImagenes = async () => {
    if (!imagenes || imagenes.length === 0) {
      console.warn("No hay imágenes para subir");
      return [];
    }
    console.log("Subiendo imágenes...");
  
    const imagenes_urls = [];
  
    for (let i = 0; i < imagenes.length; i++) {
      const formData = new FormData();
      formData.append('file', imagenes[i]);
  
      try {
        const response = await fetch('http://localhost:5000/imgs/upload', {
          method: 'POST',
          body: formData
        });
  
        if (!response.ok) {
          throw new Error(`Error al subir la imagen ${i + 1}`);
        }
  
        const data = await response.json();
        console.log("Respuesta del back completa:", data);
        imagenes_urls.push(data.location);
  
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }
    return imagenes_urls;
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
        <div className="flex flex-col md:flex-row p-6 bg-background rounded-lg shadow-lg text-start">
          
          {/* Sección de imágenes */}
          <div className="md:w-1/2 space-y-4">
            <img 
              src={producto.imagenes_urls?.[0] ||"https://placehold.co/600x600.png"}
              alt="Imagen del producto" 
              className="w-full h-auto rounded-lg shadow" 
            />
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i} 
                  src={`https://placehold.co/100x100.png?text=${i}`} 
                  className="w-16 h-16 border rounded cursor-pointer hover:opacity-80 transition" 
                  alt={`Vista ${i}`} 
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 md:pl-6 m-4">

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

            {/*AGREGADO AHORA-----------------------------------------------*/}
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex space-x-2">
            {Array.isArray(producto.imagenes_urls) && producto.imagenes_urls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={url} alt={`Imagen ${index}`} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setProducto(prev => ({
                      ...prev,
                      imagenes_urls: prev.imagenes_urls.filter((_, i) => i !== index)
                    }));
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            </div>

            {/*FIN AGREGADO AHORA--------------------------------------------------------------------*/}
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

            <button 
              type="submit" 
              // className="button-pretty w-full"
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Cargando...' : id ? 'Actualizar producto' : 'Cargar producto'}
            </button>
          </div>
        </div>
      </form>


      
    </div>
  );
}

export default FormProductoModern;
