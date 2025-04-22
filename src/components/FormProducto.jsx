import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';
import '../styles/loading.css';

function FormProducto() { 
  const { id } = useParams(); // Para editar un producto existente
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [colorMessage, setColorMessage] = useState('');

  // Estado único con todas las propiedades del producto
  const [producto, setProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_venta: ''
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      console.log('Cargando producto con ID:', id);
      fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
        .then(response => response.json())
        .then(data => setProducto(data))
        .catch(error => console.error('Error al cargar el producto:', error));
    }
  }, [id]);

  // Manejar cambios en cualquier campo
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProducto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar cambios en el editor
  const handleEditorChange = (descripcion) => {
    setProducto(prevState => ({
      ...prevState,
      descripcion
    }));
  };

  // Manejo del envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const url = id 
      ? `http://localhost:5000/Productos/update/${id}` 
      : 'http://localhost:5000/Productos/createProductos';
    
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setLoading(false);
      setMessage(id ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
      setColorMessage('verde');
      setTimeout(() => navigate("/"), 2000);
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
      {message && <div className={`alert ${colorMessage === 'verde' ? 'alert-success' : colorMessage === "rojo" ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <label htmlFor="nombre_producto"><h5>Nombre del producto</h5></label>
          <input type="text" className="form-control" id="nombre_producto" name="nombre_producto" value={producto.nombre_producto} onChange={handleChange} required />
        </div>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <h5 className='mt-2'>Descripción</h5>
          <Editor
            apiKey='1hyldt9u4byda8tjkhrxwy3zqocdzt2fujo24fy4spgi9wmc'
            onInit={(evt, editor) => editorRef.current = editor}
            init={{ height: 500, menubar: true, language: 'es' }}
            onEditorChange={handleEditorChange}
            value={producto.descripcion}
          />
        </div>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <label htmlFor="precio_venta"><h5>Precio</h5></label>
          <input type="number" className="form-control" id="precio_venta" name="precio_venta" value={producto.precio_venta} onChange={handleChange} required />
        </div>
        <div className="container text-center mt-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Cargando...' : id ? 'Actualizar producto' : 'Cargar producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormProducto;
