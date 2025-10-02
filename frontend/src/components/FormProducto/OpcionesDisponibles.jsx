import { useState } from "react";
import { X } from "lucide-react";

export default function OpcionesProducto({ producto, setProducto }) {
  const [showModal, setShowModal] = useState(false);
  const [opcionNombre, setOpcionNombre] = useState(""); // ej: Tamaño, Material
  const [tipo, setTipo] = useState("lista"); // lista | color
  const [posibilidades, setPosibilidades] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        const nueva = { name: inputValue.trim() };
        if (tipo === "color") {
          nueva.hex = "#000000"; // valor por defecto
        }
        setPosibilidades([...posibilidades, nueva]);
        setInputValue("");
      }
    }
  };

  const actualizarColor = (idx, hex) => {
    const nuevas = [...posibilidades];
    nuevas[idx].hex = hex;
    setPosibilidades(nuevas);
  };

  const eliminarOpcion = (idx) => {
    setPosibilidades(posibilidades.filter((_, i) => i !== idx));
  };

  // const handleGuardarOpcion = async () => {
  //   if (!opcionNombre || posibilidades.length === 0) return;

  //   // Guardar en estado local del producto
  //   setProducto((prev) => ({
  //     ...prev,
  //     opciones: [
  //       ...(prev.opciones || []),
  //       { nombre: opcionNombre, tipo, valores: posibilidades },
  //     ],
  //   }));

  //   // // Guardar en DB como { atributos: { [opcionNombre]: {...} } }
  //   // for (const variante of posibilidades) {
  //   //   const normalizedKey = opcionNombre.toLowerCase().trim();
  //   //   await fetch("http://localhost:5000/Variantes/create", {
  //   //     method: "POST",
  //   //     headers: { "Content-Type": "application/json" },
  //   //     body: JSON.stringify({
  //   //       producto_id: producto._id,
  //   //       atributos: {
  //   //         [normalizedKey]: {
  //   //           name: variante.name, // siempre string
  //   //           ...(variante.hex ? { hex: variante.hex } : {}),
  //   //         },
  //   //       },
  //   //     }),
  //   //   });
  //   // }

  //   // Resetear modal
  //   setOpcionNombre("");
  //   setTipo("lista");
  //   setPosibilidades([]);
  //   setInputValue("");
  //   setShowModal(false);
  // };

  const handleGuardarOpcion = async () => {
    if (!opcionNombre || posibilidades.length === 0) return;

    const normalizedKey = opcionNombre.toLowerCase().trim();

    // Mapear posibilidades a variantes
    const nuevasVariantes = posibilidades.map((pos) => ({
      atributos: {
        [normalizedKey]: {
          name: pos.name,
          ...(pos.hex ? { hex: pos.hex } : {}),
        },
      },
      cantidad: 0, // stock por defecto
    }));

    setProducto((prev) => ({
      ...prev,
      // Solo dejamos 1 título de opciones, el último agregado
      opciones: [{ nombre: opcionNombre, tipo, valores: posibilidades }],
      variantes: nuevasVariantes, // reemplazamos variantes
    }));

    console.log("Nuevas variantes agregadas:", nuevasVariantes);

    // Reset modal
    setOpcionNombre("");
    setTipo("lista");
    setPosibilidades([]);
    setInputValue("");
    setShowModal(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Opciones del producto
      </h4>

      {/* Botón para abrir modal */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        + Agregar opciones
      </button>

      {/* Listado de opciones agregadas */}
      <div className="mt-4 space-y-2">
        {producto.opciones?.length > 0 ? (
          producto.opciones.map((opt, i) => (
            <div
              key={i}
              className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <p className="font-medium">
                {opt.nombre} ({opt.tipo})
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {opt.valores.map((v, idx) =>
                  opt.tipo === "color" ? (
                    <div key={idx} className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: v.hex }}
                      ></span>
                      <span>{v.name}</span>
                    </div>
                  ) : (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {v.name || v}
                    </span>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No hay opciones agregadas</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[500px]">
            <h3 className="text-lg font-semibold mb-4">
              Agregar opciones de producto
            </h3>

            {/* Nombre de la opción */}
            <label className="block mb-2 text-sm">Nombre de la opción</label>
            <input
              type="text"
              value={opcionNombre}
              onChange={(e) => setOpcionNombre(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              placeholder="Ej: Tamaño, Material, etc."
            />

            {/* Tipo */}
            <label className="block mb-2 text-sm">
              Mostrar en página de producto como:
            </label>
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                onClick={() => setTipo("lista")}
                className={`px-4 py-2 rounded-lg border ${
                  tipo === "lista" ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                Lista
              </button>
              <button
                type="button"
                onClick={() => setTipo("color")}
                className={`px-4 py-2 rounded-lg border ${
                  tipo === "color" ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                Color
              </button>
            </div>

            {/* Input de valores */}
            <label className="block font-semibold mb-1">
              Escribe las posibilidades:
            </label>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Presiona Enter o , para agregar"
              className="border rounded px-2 py-2 w-full mb-3"
            />

            {/* Pills */}
            <div className="flex gap-2 flex-wrap mt-2 mb-4">
              {posibilidades.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full shadow-sm"
                >
                  {tipo === "color" ? (
                    <>
                      <input
                        type="color"
                        value={opt.hex}
                        onChange={(e) => actualizarColor(idx, e.target.value)}
                      />
                      <span>{opt.name}</span>
                    </>
                  ) : (
                    <span>{opt.name}</span>
                  )}
                  <X
                    className="w-4 h-4 cursor-pointer text-gray-600"
                    onClick={() => eliminarOpcion(idx)}
                  />
                </div>
              ))}
            </div>

            {/* Botones modal */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarOpcion}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
