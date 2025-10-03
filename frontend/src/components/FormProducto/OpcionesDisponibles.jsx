import { useState, useEffect } from "react";
import { X, SquarePen } from "lucide-react";

export default function OpcionesProducto({ producto, setProducto }) {
  const [showModal, setShowModal] = useState(false);
  const [opcionNombre, setOpcionNombre] = useState("");
  const [tipo, setTipo] = useState("lista");
  const [posibilidades, setPosibilidades] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 👉 Cuando el modal se abre en modo editar, precargar valores
  useEffect(() => {
    if (showModal && producto.opciones?.length > 0) {
      const opcion = producto.opciones[0];
      setOpcionNombre(opcion.nombre);
      setTipo(opcion.tipo);
      setPosibilidades(opcion.valores);
    }
  }, [showModal]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        const nueva = { name: inputValue.trim() };
        if (tipo === "color") {
          nueva.hex = "#000000";
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

  const handleGuardarOpcion = () => {
    if (!opcionNombre || posibilidades.length === 0) return;

    const nuevasVariantes = posibilidades.map((pos) => {
      const normalizedKey = opcionNombre.toLowerCase().trim();

      // buscar si ya existe una variante con este atributo
      const varianteExistente = (producto.variantes || []).find(
        (v) => v.atributos?.[normalizedKey]?.name === pos.name
      );

      return {
        _id: varianteExistente?._id || undefined,
        stock_id: varianteExistente?.stock_id || null,
        atributos: {
          [normalizedKey]: {
            name: pos.name,
            ...(pos.hex ? { hex: pos.hex } : {}),
          },
        },
        cantidad: varianteExistente ? varianteExistente.cantidad : 0,
      };
    });

    setProducto((prev) => ({
      ...prev,
      opciones: [{ nombre: opcionNombre, tipo, valores: posibilidades }],
      variantes: nuevasVariantes,
    }));

    // Reset modal
    setShowModal(false);
    setOpcionNombre("");
    setTipo("lista");
    setPosibilidades([]);
    setInputValue("");
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Opciones del producto
      </h4>

      {/* Botón agregar o editar */}
      {!producto.opciones || producto.opciones.length === 0 ? (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Agregar opciones
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            {producto.opciones.map((opt, i) => (
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
                        {v.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón editar */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition ml-3"
          >
            <SquarePen className="w-5 h-5 text-indigo-700" />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[500px]">
            <h3 className="text-lg font-semibold mb-4">
              {producto.opciones?.length > 0
                ? "Editar opciones de producto"
                : "Agregar opciones de producto"}
            </h3>

            {/* Nombre */}
            <label className="block mb-2 text-sm">Nombre de la opción</label>
            <input
              type="text"
              value={opcionNombre}
              onChange={(e) => setOpcionNombre(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              placeholder="Ej: Tamaño"
            />

            {/* Tipo */}
            <label className="block mb-2 text-sm">Mostrar como:</label>
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

            {/* Input valores */}
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

            {/* Botones */}
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
