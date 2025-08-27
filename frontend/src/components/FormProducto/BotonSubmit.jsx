// BotonSubmit.jsx
export default function BotonSubmit({ loading, id }) {
    return (
      <button 
        type="submit" 
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Cargando...' : id ? 'Actualizar producto' : 'Cargar producto'}
      </button>
    );
  }
  