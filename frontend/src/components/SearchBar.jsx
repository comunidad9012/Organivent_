import { useContext } from "react";
import { Search } from "lucide-react";
import { FiltersContext } from "./context/filters";

const SearchBar = () => {
  const { filters, setFilters } = useContext(FiltersContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // acá no buscás directamente, solo actualizás el estado global
    // Productos.jsx se encarga de hacer el fetch
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex-1 max-w-md mx-4"
    >
      <input
        type="text"
        placeholder="Buscar productos..."
        value={filters.query}
        onChange={(e) =>
          setFilters({ ...filters, query: e.target.value })
        }
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </form>
  );
};

export default SearchBar;
