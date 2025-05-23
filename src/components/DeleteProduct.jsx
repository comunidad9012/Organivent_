function DeleteProduct( { product, setProductos, setMessage, setColorMessage }) {

     // Función para borrar un producto //deberia estar acá??
 const handleDelete = async (product_id, productName) => {
    const confirmDelete = window.confirm(`¿Estás seguro de borrar "${productName}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/Productos/deleteProductos/${product_id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Actualiza la lista de productos eliminando el que fue borrado
        setProductos((prevProductos) => prevProductos.filter((product) => product._id !== product_id));
        setMessage(`Producto "${productName}" eliminado con éxito.`);
        setColorMessage('verde');
      } else {
        setMessage(data.message || "Hubo un error al intentar eliminar el producto.");
        setColorMessage('rojo');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setMessage("Hubo un problema al intentar eliminar el producto.");
    }

    // Oculta el mensaje después de unos segundos
    setTimeout(() => setMessage(""), 3000);
  };


  return (
    <button type="button" className="btn btn-danger mt-2" onClick={() => handleDelete(product._id, product.nombre_producto)}>
        Borrar
    </button>
    )
}
export default DeleteProduct