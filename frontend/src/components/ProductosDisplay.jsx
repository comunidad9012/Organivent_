import React from 'react';
import { Link } from 'react-router-dom';
import defaultImg from "../assets/react.svg"; // 👈 fallback local

function ProductosDisplay({ Productos }) {
  console.log("Productos recibidos:", Productos); // 👈 log global
  return (
    <div>
      <div className="row mx-auto d-flex justify-content-center align-items-center mt-4">
        {Productos.map((item, index) => {
          console.log("Producto:", item); // 👈 log por producto
          return (
            <React.Fragment key={item._id}>
              <div className="col-md-4 mi-clase-css mt-4">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.nombre_producto}</h5>
                    <p>{JSON.stringify(item.imagenes)}</p>
                  </div>
                  <img
                    src={item.imagenes?.[0]?.url || defaultImg}
                    alt={item.nombre_producto}
                    style={{ maxWidth: "100%", height: 200, objectFit: "contain" }}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}