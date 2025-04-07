import React, { useState } from 'react';
import ProductosDisplay from './ProductosDisplay'; 

function SearchForm() {
    const [palabra, setQuery] = useState('');
    const [Productos, setProductos] = useState([]); 

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { palabra };
        try {
            const response = await fetch('http://localhost:5000/Productos/find_product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const responseData = await response.json();
                setProductos(responseData);
            } else {
                console.error('Error al obtener los datos del backend');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="search-header">
            <form className="d-flex" onSubmit={handleSubmit} role="search">
                <input className="search-header__input form-control me-2" type="search" id="palabra" value={palabra} onChange={handleQueryChange} required placeholder="Buscar producto" aria-label="Search"/>
                <button className="search-header__button btn btn-outline-success" type="submit">
                    <svg
                        fill="none"
                        viewBox="0 0 18 18"
                        height="18"
                        width="18"
                        className="search-header__icon"
                    >
                        <path
                            fill="#3A3A3A"
                            d="M7.132 0C3.197 0 0 3.124 0 6.97c0 3.844 3.197 6.969 7.132 6.969 1.557 0 2.995-.49 4.169-1.32L16.82 18 18 16.847l-5.454-5.342a6.846 6.846 0 0 0 1.718-4.536C14.264 3.124 11.067 0 7.132 0zm0 .82c3.48 0 6.293 2.748 6.293 6.15 0 3.4-2.813 6.149-6.293 6.149S.839 10.37.839 6.969C.839 3.568 3.651.82 7.132.82z"
                        ></path>
                    </svg>
                </button>
            </form>
            <ProductosDisplay Productos={Productos} />
            {/* Ver de resetear la variable o cambiar el componente */}
        </div>
    );
}

export default SearchForm;
