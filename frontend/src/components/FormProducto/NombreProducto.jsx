// NombreProducto.jsx
export default function NombreProducto({ producto, handleChange }) {
    return (
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
    );
  }
  