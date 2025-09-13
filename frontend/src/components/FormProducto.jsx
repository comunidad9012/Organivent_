import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Loading from '../utilities/Loading';
import '../styles/loading.css';
import { PrivateRoutes } from '../models/routes';
import { toast } from 'sonner';
import GaleriaProducto from "./FormProducto/GaleriaProducto";
import NombreProducto from "./FormProducto/NombreProducto";
import GaleriaImagenesForm from "./FormProducto/GaleriaImagenesForm";
import ColoresDisponibles from "./FormProducto/ColoresDisponibles";
import CategoriaForm from "./FormProducto/CategoriaForm";
import DescripcionProducto from "./FormProducto/DescripcionProducto";
import BotonSubmit from "./FormProducto/BotonSubmit";

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
  
    // fetch(url, {
    //   method,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(finalProducto)
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setLoading(false);
    //     toast.success(id ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
    //     setTimeout(() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, { replace: true }), 2000);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //     setLoading(false);
    //     toast.error(id ? 'Error al actualizar el producto.' : 'Error al crear el producto.');
    //   });
    fetch(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(finalProducto)
})
  .then(async response => {
    const data = await response.json();
    if (!response.ok) {
      if (data.errors) {
        Object.values(data.errors).forEach(msg => toast.error(msg));
      } else {
        toast.error('Error en el servidor');
      }
      throw new Error("Error en validación");
    }
    return data;
  })
  .then(data => {
    setLoading(false);
    toast.success(id ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
    setTimeout(() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, { replace: true }), 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    setLoading(false);
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
              <GaleriaProducto
                imagenSeleccionada={imagenSeleccionada}
                setImagenSeleccionada={setImagenSeleccionada}
                imagenes={imagenes}
                producto={producto}
                getAllImages={getAllImages}
                currentThumbnailIndex={currentThumbnailIndex}
                prevThumbnails={prevThumbnails}
                nextThumbnails={nextThumbnails}
              />
            </div>
            {/* Columna derecha */}
            <div className="md:w-1/2 md:pl-6 space-y-6">
              <NombreProducto producto={producto} handleChange={handleChange} />

              <GaleriaImagenesForm
                producto={producto}
                imagenes={imagenes}
                setImagenes={setImagenes}
                setProducto={setProducto}
                setImagenSeleccionada={setImagenSeleccionada}
              />

              {/* Precio */}
              <div className="infield mb-6">
                <input 
                  required
                  type="number" 
                  min="1"
                  name="precio_venta" 
                  value={producto.precio_venta}
                  onChange={handleChange}
                  placeholder="Precio de venta"
                />
                <label></label>
              </div>

              <ColoresDisponibles
                producto={producto}
                setProducto={setProducto}
                nuevoColor={nuevoColor}
                setNuevoColor={setNuevoColor}
              />
            </div>
          </div>

          {/* Sección Baja */}
          <CategoriaForm
            producto={producto}
            setProducto={setProducto}
            categorias={categorias}
            setCategorias={setCategorias}
            mostrarFormularioCategoria={mostrarFormularioCategoria}
            setMostrarFormularioCategoria={setMostrarFormularioCategoria}
            nuevaCategoria={nuevaCategoria}
            setNuevaCategoria={setNuevaCategoria}
          />

          <DescripcionProducto
            editorRef={editorRef}
            handleEditorChange={handleEditorChange}
            producto={producto}
          />

          <BotonSubmit loading={loading} id={id} />

        </div>
      </form>
    </div>
  );
}

export default FormProductoModern;