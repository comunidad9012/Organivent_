import React from 'react';
import { Link } from 'react-router-dom';

function ProductosDisplay({ Productos }) {
    return (
        <div>
            <div className="row mx-auto d-flex justify-content-center align-items-center mt-4">
                {Productos.map((item, index) => (
                    <React.Fragment key={item._id}>
                        <div className="col-md-4 mi-clase-css mt-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{item.titulo}</h5>
                                    <Link to={`/Productos/viewproduct/${item._id}`}>Leer</Link>
                                    <p className="card-text"><small className="text-body-secondary">{item.fecha}</small></p>
                                </div>
                                <div className="mt-auto">
                                    <hr className="my-1"></hr>
                                    <img src={item.miniatura} classname="card-img-bottom" alt="..." style={{ maxWidth: "100%", height: 200, objectFit: "contain" }} />
                                </div>
                            </div>
                        </div>
                        {index % 3 === 2 && <div className="w-100"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ProductosDisplay;
