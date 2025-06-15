import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { EstadosPedido } from '../models/Estado_Pedido/enums'
import EstadoPedido from '../models/Estado_Pedido/EstadoPedido'

// FilterState.jsx
function FilterState({ estado, setEstado }) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={estado}
          onValueChange={(value) => {
            setEstado(value === "__ALL__" ? "" : value);
          }}
        >
          <SelectTrigger className="bg-white border border-gray-300 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50 border border-gray-200 shadow-lg rounded">
            <SelectItem value="__ALL__">Todos</SelectItem>
            {EstadosPedido.map((estado) => (
              <SelectItem key={estado} value={estado}>
                <EstadoPedido estado={estado} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        {estado && (
          <button
            onClick={() => setEstado("")}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Limpiar filtro
          </button>
        )}
      </div>
    );
  }
  export default FilterState;
  