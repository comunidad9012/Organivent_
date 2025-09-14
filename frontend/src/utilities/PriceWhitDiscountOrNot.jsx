import { Ticket} from 'lucide-react';
import FormatoPrecio from "./FormatoPrecio";

function PriceWhitDiscountOrNot( { product} ) {
  return (
    <div>
      {product.descuento_aplicado ? (
        <div className="flex flex-col space-y-1">
          {/* Precio original tachado */}
          <p className="text-left text-gray-500 text-sm line-through mb-1">
            ${Number(product.precio_original).toLocaleString("es-AR")}
          </p>
          <div className="grid grid-cols-2 gap-2 items-center">
            {/* Precio con descuento */}
            <FormatoPrecio
              valor={Number(product.precio_final)}
              className="text-black font-bold text-lg"
            />
            {/* Badge del descuento */}
            <span className="w-15 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {product.descuento_aplicado.tipo === "porcentaje"
                ? `-${product.descuento_aplicado.valor}%`
                : `-$${product.descuento_aplicado.valor}`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 items-center text-xs text-green-800 bg-green-100 rounded text-center">
            <Ticket className="ml-3 w-5" />
            <p className="col-span-3 m-1 text-left ">
              {product.descuento_aplicado.nombre}
            </p>
          </div>
        </div>
      ) : (
        // Si no tiene descuento, muestro solo el precio normal
        <FormatoPrecio
          valor={Number(product.precio_venta)}
          className="text-black font-bold text-lg"
        />
      )}
    </div>
  );
}
export default PriceWhitDiscountOrNot;
