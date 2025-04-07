//entiendo que este contexto no le hizo falta el reducer porque no tiene mas que un estado que lo lee entre componentes, si necesitaba lógica de negocio o algo mas complejo ahi si necesitaba el reducer.


import { createContext, useState } from 'react'

//1º crear el contexto
// Este es el que tenemos que consumir
export const FiltersContext = createContext()

//2º crear el provider, para proveer el contexto
// Este es el que nos provee de acceso al contexto
export function FiltersProvider ({ children }) {
  const [filters, setFilters] = useState({ 
    category: "",
    id_categoria: "",
    //minPrice: 0
  })

  return (
    <FiltersContext.Provider value={{ filters, setFilters}}>
      {children}
    </FiltersContext.Provider>
  )
}

//3º consumir el contexto