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
    categoria_id: "",
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
    if (id) {
      fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
        .then((response) => response.json())
        .then((data) => {
          // Transformar variantes para el formulario
          const variantesTransformadas =
            data.variantes?.map((v) => ({
              atributos: {
                color: v.atributos.color?.name || "", //esto está mal, no sabemos que titulo va a tener el atributo
                tamaño: v.atributos.tamaño || "",
              },
              cantidad: v.stock || 0,
            })) || [];

          setProducto({
            ...data,
            es_stock: variantesTransformadas.length > 0,
            variantes: variantesTransformadas,
          });
        })
        .catch((error) => console.error("Error al cargar el producto:", error));
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
      // 1️⃣ Subir imágenes nuevas
      const nuevas = await subirImagenes();
      const nuevasImgs = nuevas.map((img) => ({
        _id: img._id,
        url: img.url,
      }));

      // 2️⃣ Construir objeto final del producto
      const { variantes, es_stock, ...productoSinVariantes } = producto; // como es que guarda el stock en un producto sin variables si quedamos en que lo iba a guardar en una variante "unica" para linkearle el stock?

      console.log("variantes desestructuradas:", variantes);

      const finalProducto = {
        ...productoSinVariantes,
        imagenes: [...(producto.imagenes || []), ...nuevasImgs],
      };

      // 3️⃣ Guardar producto (create o update)
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
      //borrar
      const productoCreado = await productoRes.json();

      console.log("\nProducto ID A VERRR SI SALE:", productoCreado._id);

      const productoId = productoCreado._id;
      console.log("productos.variantes:", producto.variantes);

      // 4️⃣ Si hay variantes -> procesarlas
      if (producto.variantes?.length > 0) {
        console.log("Variantes a crear:", producto.variantes);

        for (const variante of producto.variantes) {
          const varianteBody = {
            producto_id: productoId,
            atributos: variante.atributos,
          };

          console.log("🔥 varianteBody que se manda al backend:", varianteBody);

          const varianteRes = await fetch(
            "http://localhost:5000/Variantes/create",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(varianteBody),
            }
          );

          if (!varianteRes.ok) {
            console.error(
              "❌ Error creando variante:",
              await varianteRes.text()
            );
            continue;
          }

          const varianteCreada = await varianteRes.json();
          console.log("✅ Variante creada:", varianteCreada);

          // Stock
          const stockRes = await fetch("http://localhost:5000/Stock/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variante_id: varianteCreada._id,
              cantidad: variante.cantidad,
            }),
          });

          if (!stockRes.ok) {
            console.error("❌ Error creando stock:", await stockRes.text());
          } else {
            console.log("✅ Stock creado para variante:", varianteCreada._id);
          }
        }
      }

      // if (!producto.variantes || producto.variantes.length === 0) {
      //   const varianteBody = {
      //     producto_id: productoId,
      //     atributos: { default: { name: "unico" } },
      //   };

      //   const varianteRes = await fetch(
      //     "http://localhost:5000/Variantes/create",
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(varianteBody),
      //     }
      //   );

      //   const varianteCreada = await varianteRes.json();

      //   // Crear stock lo dejamos comentado por ahora
      //   // await fetch("http://localhost:5000/Stock/create", {
      //   //   method: "POST",
      //   //   headers: { "Content-Type": "application/json" },
      //   //   body: JSON.stringify({
      //   //     variante_id: varianteCreada._id,
      //   //     cantidad: producto.stock || 0,
      //   //   }),
      //   // });
      // }

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
