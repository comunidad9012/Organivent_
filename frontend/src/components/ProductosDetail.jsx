import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CartProduct from './CartProduct';
import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";

function ProductoDetail() {
  const [Producto, setProducto] = useState({});
  const { id } = useParams();

  const [selectedColor, setSelectedColor] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);


  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

  useEffect(() => {
    fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
      .then(response => response.json())
      .then(data => {
        setProducto(data);
        if (data.imagenes && data.imagenes.length > 0) {
          setImagenSeleccionada(data.imagenes[0]);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Helmet>
        <title>{Producto.nombre_producto}</title>
        {/* corregir el nombre */}
      </Helmet>
      {/* <h1>{Producto.nombre_producto}</h1>
      <div dangerouslySetInnerHTML={{ __html: Producto.nombre_producto }} /> */}

      <div className="flex flex-col lg:flex-row gap-6 bg-background rounded-lg shadow-lg p-6">
        { /* Sección de imágenes */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="w-full h-[400px] flex items-center justify-center overflow-hidden bg-white rounded">
            <img 
              src={imagenSeleccionada || "https://placehold.co/600x600.png"} 
              alt="Imagen principal del producto" 
              className="h-full object-contain" 
            />
          </div>
          
          {Producto.imagenes && Producto.imagenes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Producto.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Miniatura ${index}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${
                    imagenSeleccionada === img ? "border-black" : "border-transparent"
                  }`}
                  onClick={() => setImagenSeleccionada(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sección de detalle */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="text-3xl font-bold text-foreground">{Producto.nombre_producto}</h2>
          <h5 className="text-2xl text-primary my-4">${Producto.precio_venta}</h5>
          <div className="flex items-center mt-2">
              <span className="flex items-center text-yellow-500">★★★★☆</span>
              {/* VER ESTO DE LAS ESTRELLAS MAS ADELANTE */}
          </div>  

          <div 
            dangerouslySetInnerHTML={{ __html: Producto.descripcion }} 
            className="mt-2 mr-5 text-muted-foreground"
          />
          {/* <p className="mt-2 text-muted-foreground">
              The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.
          </p> */}
          
          {/* Colores disponibles */}
          {Producto.colores && Producto.colores.length > 0 && (
            <div className="mt-6">
              <span className="block mb-2 text-muted-foreground">Colores disponibles:</span>
              <div className="flex gap-3 flex-wrap">
                {Producto.colores.map((color, index) => (
                  <div
                    key={index}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border border-black/10  cursor-pointer ${
                      selectedColor?.hex === color.hex ?  'ring-2 ring-offset-2 ring-zinc-500' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-sm text-gray-500">Color seleccionado: {selectedColor.name}</p>
              )}
              {selectedColor == null && (
                <p className="mt-2 text-sm text-red-500">Por favor selecciona un color</p>
              )}
            </div>
          )}

          {/* Agregar al carrito */}
          <div className="flex flex-col justify-end mt-6">
            {userState.rol !== Roles.ADMIN && (
              <CartProduct 
                product={Producto} 
                selectedColor={selectedColor} 
                //aca sería pasarle los selectedCaracteristicas que sean necesarias pasandosela como props
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductoDetail;
