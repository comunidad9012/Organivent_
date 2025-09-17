import { Ticket } from 'lucide-react';
import FormatoPrecio from "./FormatoPrecio";

function PriceWhitDiscountOrNot({ product }) {
  // En pedidos viene guardado; en productos puede venir solo el precio actual
  const precioOriginal =
    product.precio_original ??
    product.precio_venta ??
    product.precio_unitario ??
    0;

  const precioFinal =
    product.precio_final ??
    product.precio_unitario ??
    product.precio_venta ??
    0;

  const descuento = product.descuento_aplicado;

  return (
    <div>
      {descuento ? (
        <div className="flex flex-col space-y-1">
          {/* Precio original tachado */}
          <p className="text-left text-gray-500 text-sm line-through mb-1">
            ${Number(precioOriginal).toLocaleString("es-AR")}
          </p>

          <div className="grid grid-cols-2 gap-2 items-center">
            {/* Precio con descuento */}
            <FormatoPrecio
              valor={Number(precioFinal)}
              className="text-black font-bold text-lg"
            />

            {/* Badge del descuento */}
            <span className="w-15 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {descuento.tipo === "porcentaje"
                ? `-${descuento.valor}%`
                : `-$${Number(descuento.valor).toLocaleString("es-AR")}`}
            </span>
          </div>

          {/* Nombre del descuento */}
          <div className="grid grid-cols-4 gap-2 items-center text-xs text-green-800 bg-green-100 rounded text-center">
            <Ticket className="ml-3 w-5" />
            <p className="col-span-3 m-1 text-left ">
              {descuento.nombre}
            </p>
          </div>
        </div>
      ) : (
        // Si no tuvo descuento en el pedido o no aplica
        <FormatoPrecio
          valor={Number(precioFinal)}
          className="text-black font-bold text-lg"
        />
      )}
    </div>
  );
}

export default PriceWhitDiscountOrNot;
