import React, { useState, useEffect } from 'react';
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
        <section className='filters'>
    
          {/* <div>
            <label htmlFor={minPriceFilterId}>Precio a partir de:</label>
            <input
              type='range'
              id={minPriceFilterId}
              min='0'
              max='1000'
              onChange={handleChangeMinPrice}
              value={filters.minPrice}
            />
            <span>${filters.minPrice}</span>
          </div> */}
    
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" href=''> 
                {/* le saque el href arriba*/}
                Categorías
                {filters.category && <p className="badge bg-secondary">{filters.category}</p>}

            </a>
            <ul className="dropdown-menu">
                <li>
                {/* cambiar el alert alert-info por algo mas normal pero que lo diferencie del resto */}
                    <div className="dropdown-item alert alert-info" onClick={() => setFilters((prevFilters) => ({
                          ...prevFilters,
                          category: "",
                          id_categoria: ""
                        }))}>
                        Todas las categorías
                    </div>
                </li>
                {listaCategorias.map((categoria) => (
                    <li key={categoria._id}>
                        <div className="dropdown-item" 
                  
                        onClick={() => 
                              setFilters((prevFilters) => ({
                              ...prevFilters,
                              category: categoria.nombre_categoria,
                              id_categoria: categoria._id
                              }))}>
                            {categoria.nombre_categoria}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    
        </section>
      )
}
export default Categorias;
