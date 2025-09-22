import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="relative flex-1 max-w-md mx-4">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Buscar productos..."
      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  </form>
);

export default SearchBar;
