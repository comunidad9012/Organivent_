import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem

} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";

import { useState, useEffect } from 'react';
import { useContext } from 'react'
import { FiltersContext } from './context/filters.jsx' 


function Categorias() {
      const [listaCategorias, setListaCategorias] = useState([]);
      const {filters , setFilters } = useContext(FiltersContext) //consumo el contexto de los filtros
      //AGREGAR filters PARA VER QUE SE ELIJIÓ
  
  
      // //logica de filtros
      // const minPriceFilterId = useId()
  
      // const handleChangeMinPrice = (event) => {
      //     setFilters(prevState => ({
      //       ...prevState,
      //       minPrice: event.target.value
      //     }))
      //   }
      
    
        //fech de categorias
        useEffect(() => {
          fetch('http://localhost:5000/Categoria/showCategorias')
              .then((response) => response.json())
              .then((data) => setListaCategorias(data))
              .catch((error) => console.error('Error fetching categories:', error));
      }, []);
  
        return (
          <DropdownMenu>
             <DropdownMenuTrigger asChild>
              <div className="flex items-center text-gray-700 space-x-2 px-2 py-1 mt-1 rounded-md hover:bg-gray-100 transition">
                Categorías
                <ChevronDown className="w-4 h-4 mx-2 text-gray-600" />
              </div>
            </DropdownMenuTrigger>
              
            <DropdownMenuContent className="bg-white dark:bg-zinc-900  right-0 z-50  mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5">
              <DropdownMenuItem className="px-4 py-2 hover:bg-blue-50">
              <div className="block w-full text-sm text-blue-500" onClick={() => setFilters((prevFilters) => ({
                          ...prevFilters,
                          category: "",
                          id_categoria: ""
                        }))}>
                        Todas las categorías
                    </div>
              </DropdownMenuItem>
              {listaCategorias.map((categoria) => (
                        <div key={categoria._id} className="dropdown-item" 
                  
                        onClick={() => 
                              setFilters((prevFilters) => ({
                              ...prevFilters,
                              category: categoria.nombre_categoria,
                              id_categoria: categoria._id
                              }))}>
                             <DropdownMenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              {categoria.nombre_categoria}
                            </DropdownMenuItem>
                        </div>
                ))}
             
              
            </DropdownMenuContent>
          </DropdownMenu>
          
        )
  }
  export default Categorias;