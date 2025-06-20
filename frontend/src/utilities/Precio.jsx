import React from "react";

const Precio = ({ valor , className}) => {
  const { entero, decimales } = formatearPrecio(valor);

  return (
    <div className={`flex items-start ${className}`}>
      <span>${entero}</span>
      <span className="text-xs ml-0.5 mt-0.5">{decimales}</span>
    </div>
  );
};

function formatearPrecio(precio) {
  const [entero, decimales] = precio
    .toFixed(2)
    .toString()
    .split(".");

  const parteEnteraFormateada = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return {
    entero: parteEnteraFormateada,
    decimales,
  };
}

export default Precio;
