import { EstadoDePedido } from "./enums"; 

interface Props {
  estado: EstadoDePedido;
}

const estilos: Record<EstadoDePedido, string> = {
  "Pendiente": "bg-orange-100 text-orange-800",
  "Aceptado": "bg-green-100 text-green-800",
  "Listo para la entrega" : "bg-yellow-100 text-yellow-800",
  "Cancelado": "bg-red-100 text-red-800",
  "Entregado": "bg-blue-100 text-blue-800",
};

const EstadoPedido = ({ estado }: Props) => {
  return (
    <span className={`text-sm px-4 py-1 rounded-full font-medium ${estilos[estado]}`}>
      {estado}
    </span>
  );
};

export default EstadoPedido;
