import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Loading from "../utilities/Loading";
import "../styles/loading.css";
import { PrivateRoutes } from "../models/routes";
import { toast } from "sonner";
import GaleriaProducto from "./FormProducto/GaleriaProducto";
import NombreProducto from "./FormProducto/NombreProducto";
import GaleriaImagenesForm from "./FormProducto/GaleriaImagenesForm";
import CategoriaForm from "./FormProducto/CategoriaForm";
import DescripcionProducto from "./FormProducto/DescripcionProducto";
import BotonSubmit from "./FormProducto/BotonSubmit";
import VariantesStockForm from "./FormProducto/VariantesStockForm";
import PrecioForm from "./FormProducto/PrecioForm";
import OpcionesProducto from "./FormProducto/OpcionesDisponibles";

function FormProductoModern() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [producto, setProducto] = useState({
    nombre_producto: "",
    descripcion: "",
    precio_venta: "",
    imagenes: [],
    // colores: [],
    categoria_id: "", //ver si sacar este
  });
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion: "",
    subcategorias: [],
  });
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] =
    useState(false);
  // const [nuevoColor, setNuevoColor] = useState({ name: "", hex: "#000000" });
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  // Obtener las categorías al cargar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/Categoria/showCategorias"
        );
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!producto.opciones || producto.opciones.length === 0) {
      // Si no existen variantes, inicializamos una variante "única"
      if (!producto.variantes || producto.variantes.length === 0) {
        setProducto((prev) => ({
          ...prev,
          variantes: [
            {
              _id: undefined,
              stock_id: null,
              atributos: { unica: { name: "Única" } },
              cantidad: 0,
            },
          ],
          es_stock: true,
        }));
      }
    }
  }, [producto.opciones]);

  useEffect(() => {
    if (id) {
      const fetchProducto = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:5000/Productos/viewProductos/${id}`
          );
          if (!res.ok) throw new Error("Error al cargar producto");
          const data = await res.json();

          // 🔹 Merge variantes: preserva cantidad y stock_id
          const variantesTransformadas = (data.variantes || []).map((v) => {
            const existente = producto?.variantes?.find((x) => x._id === v._id);
            return {
              _id: v._id,
              stock_id: v.stock?._id || null, // 👈 siempre string, nunca undefined
              atributos: v.atributos,
              cantidad: existente ? existente.cantidad : v.stock?.cantidad ?? 0,
            };
          });

          setProducto({
            ...data,
            variantes: variantesTransformadas,
            variantes_existentes_backend: data.variantes || [],
          });
        } catch (error) {
          console.error("Error al cargar producto:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducto();
    }
  }, [id]);

  // limpia los objetos URL generados con URL.createObjectURL
  useEffect(() => {
    return () => {
      imagenes.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [imagenes]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (descripcion) => {
    setProducto((prev) => ({ ...prev, descripcion }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const total = files.length + producto.imagenes.length;

    if (total > 10) {
      toast.error("Máximo 10 imágenes por producto.");
      return;
    }

    setImagenes(files);
  };

  const subirImagenes = async () => {
    if (!imagenes || imagenes.length === 0) {
      console.warn("No hay imágenes para subir");
      return [];
    }

    const formData = new FormData();
    imagenes.forEach((img) => formData.append("file", img)); // 👈 singular

    try {
      const response = await fetch("http://localhost:5000/imgs/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir imágenes");
      }

      const data = await response.json();
      // console.log("Respuesta backend imágenes:", data);
      return data.locations; // backend devuelve [{ _id, filename, url }]
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      return [];
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Subir imágenes
      const nuevas = await subirImagenes();
      const nuevasImgs = nuevas.map((img) => ({ _id: img._id, url: img.url }));

      // 2️⃣ Guardar producto principal
      const { variantes, es_stock, ...productoSinVariantes } = producto;
      const finalProducto = {
        ...productoSinVariantes,
        imagenes: [...(producto.imagenes || []), ...nuevasImgs],
      };

      const url = id
        ? `http://localhost:5000/Productos/update/${id}`
        : "http://localhost:5000/Productos/createProductos";
      const method = id ? "PUT" : "POST";

      const productoRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProducto),
      });
      if (!productoRes.ok) throw new Error("Error al guardar producto");
      const productoCreado = await productoRes.json();
      const productoId = id ? id : productoCreado._id;

      // 3️⃣ Variantes
      const variantesBackend = producto.variantes_existentes_backend || [];
      const variantesForm = producto.variantes || [];

      // 3a️⃣ Eliminar variantes borradas
      const idsForm = variantesForm.map((v) => v._id).filter(Boolean);
      const aEliminar = variantesBackend.filter(
        (v) => !idsForm.includes(v._id)
      );
      for (const v of aEliminar) {
        await fetch(`http://localhost:5000/Variantes/delete/${v._id}`, {
          method: "DELETE",
        });
      }

      // 3b️⃣ Crear o actualizar variantes y stock
      for (const v of variantesForm) {
        if (v._id) {
          // actualizar variante
          await fetch(`http://localhost:5000/Variantes/update/${v._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ atributos: v.atributos }),
          });

          // actualizar stock
          if (v.stock_id) {
            await fetch(`http://localhost:5000/Stock/update/${v.stock_id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cantidad: v.cantidad }),
            });
          } else {
            // crear stock nuevo si no existía
            const stockRes = await fetch("http://localhost:5000/Stock/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                variante_id: v._id,
                cantidad: v.cantidad,
              }),
            });
            const stockData = await stockRes.json();
            v.stock_id = stockData._id;
          }
        } else {
          // crear variante nueva
          const varianteRes = await fetch(
            "http://localhost:5000/Variantes/create",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                producto_id: productoId,
                atributos: v.atributos,
              }),
            }
          );
          const varianteData = await varianteRes.json();
          v._id = varianteData._id;

          // crear stock
          const stockRes = await fetch("http://localhost:5000/Stock/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ variante_id: v._id, cantidad: v.cantidad }),
          });
          const stockData = await stockRes.json();
          v.stock_id = stockData._id;
        }
      }

      setLoading(false);
      toast.success(id ? "Producto actualizado!" : "Producto creado!");
      setTimeout(
        () =>
          navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ADMIN}`, {
            replace: true,
          }),
        1500
      );
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setLoading(false);
      toast.error("Error al guardar el producto.");
    }
  };

  // Función para obtener todas las imágenes (existentes + nuevas)
  const getAllImages = () => {
    const existingImages = (producto.imagenes || []).map((img) => ({
      type: "existing",
      url: img.url,
      original: img,
    }));

    const newImages = imagenes.map((img) => ({
      type: "new",
      url: URL.createObjectURL(img),
      original: img,
    }));

    return [...existingImages, ...newImages];
  };

  // Funciones para navegar en el carrusel
  const nextThumbnails = () => {
    const allImages = getAllImages();
    const maxIndex = Math.max(0, allImages.length - 3);
    setCurrentThumbnailIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevThumbnails = () => {
    setCurrentThumbnailIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <Helmet>
        <title>{id ? "Editar Producto" : "Añadir Producto"}</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-center my-5">
        {id ? "Editar Producto" : "Nuevo Producto"}
      </h1>

      {loading && <Loading />}

      <form onSubmit={handleSubmit}>
        <div className="p-4 bg-background rounded-lg shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Columna izquierda */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <GaleriaProducto
                imagenSeleccionada={imagenSeleccionada}
                setImagenSeleccionada={setImagenSeleccionada}
                imagenes={imagenes}
                producto={producto}
                getAllImages={getAllImages}
                currentThumbnailIndex={currentThumbnailIndex}
                prevThumbnails={prevThumbnails}
                nextThumbnails={nextThumbnails}
              />
            </div>
            {/* Columna derecha */}
            <div className="md:w-1/2 md:pl-6 space-y-6">
              <NombreProducto producto={producto} handleChange={handleChange} />

              <GaleriaImagenesForm
                producto={producto}
                imagenes={imagenes}
                setImagenes={setImagenes}
                setProducto={setProducto}
                setImagenSeleccionada={setImagenSeleccionada}
              />

              {/* Precio */}
              <PrecioForm producto={producto} setProducto={setProducto} />

              <OpcionesProducto producto={producto} setProducto={setProducto} />

              {/* Variantes */}
              <VariantesStockForm
                producto={producto}
                setProducto={setProducto}
              />
            </div>
          </div>

          {/* Sección Baja */}
          <CategoriaForm
            producto={producto}
            setProducto={setProducto}
            categorias={categorias}
            setCategorias={setCategorias}
            mostrarFormularioCategoria={mostrarFormularioCategoria}
            setMostrarFormularioCategoria={setMostrarFormularioCategoria}
            nuevaCategoria={nuevaCategoria}
            setNuevaCategoria={setNuevaCategoria}
          />

          <DescripcionProducto
            editorRef={editorRef}
            handleEditorChange={handleEditorChange}
            producto={producto}
          />

          <BotonSubmit loading={loading} id={id} />
        </div>
      </form>
    </div>
  );
}

export default FormProductoModern;
