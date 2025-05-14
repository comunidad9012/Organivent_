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


  const userState = useSelector(store => store.user) //consumo el estado de redux para saber si el usuario es admin o no

  useEffect(() => {
    fetch(`http://localhost:5000/Productos/viewProductos/${id}`)
      .then(response => response.json())
      .then(data => setProducto(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  return (
    <div>
      <Helmet>
        <title>{Producto.nombre_producto}</title>
        {/* corregir el nombre */}
      </Helmet>
      {/* <h1>{Producto.nombre_producto}</h1>
      <div dangerouslySetInnerHTML={{ __html: Producto.nombre_producto }} /> */}

      <div className="flex flex-col md:flex-row p-6 bg-background rounded-lg shadow-lg text-start">
          <div className="md:w-1/2 m-4">
              <img 
                  src="https://placehold.co/600x600.png" 
                  alt="Zip Tote Basket" 
                  className="w-full h-auto rounded-lg" 
              />
              <div className="flex space-x-2 mt-4">
                  <img 
                      src="https://placehold.co/100x100.png" 
                      alt="Thumbnail 1" 
                      className="w-16 h-16 border rounded cursor-pointer" 
                  />
                  <img 
                      src="https://placehold.co/100x100.png" 
                      alt="Thumbnail 2" 
                      className="w-16 h-16 border rounded cursor-pointer" 
                  />
                  <img 
                      src="https://placehold.co/100x100.png" 
                      alt="Thumbnail 3" 
                      className="w-16 h-16 border rounded cursor-pointer" 
                  />
              </div>
          </div>
          <div className="md:w-1/2 md:pl-6">
              <h2 className="text-2xl font-bold text-foreground mt-5 mr-5">{Producto.nombre_producto}</h2>
              <h5 className="text-3xl text-primary my-4">${Producto.precio_venta}</h5>
              <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★★★★☆</span>
                  {/* VER ESTO DE LAS ESTRELLAS MAS ADELANTE */}
              </div>  

              <div dangerouslySetInnerHTML={{ __html: Producto.descripcion }} className="mt-2 mr-5 text-muted-foreground"/>
              {/* <p className="mt-2 text-muted-foreground">
                  The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.
              </p> */}
              

               {/* Colores disponibles */}
               {Producto.colores && Producto.colores.length > 0 && (
                  <div className="mt-4">
                    <span className="block text-muted-foreground">Colores disponibles:</span>
                    <div className="flex gap-x-3 mt-2">
                      {Producto.colores.map((color, index) => (
                        <div
                          key={index}
                          title={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border border-black/10  cursor-pointer ${selectedColor?.hex === color.hex ?  'ring-2 ring-offset-2 ring-zinc-500' : ''}`}
                          style={{ backgroundColor: color.hex }}
                        ></div>
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


    
              <div className="flex flex-col justify-end mt-4">
              
              {userState.rol === Roles.USER && (
                <CartProduct product={Producto} selectedColor={selectedColor} />
              )}
                {/* ESTE BOTON NO SE MANTIENE COMO QUE YA ESTA EN EL CARRITO SINO QUE deja añadir mas del mismo y salen los dos en el carrito, tenia pensado dejar esto para cuando cuztomizan dos productos que son el mismo pero con diferentes caracteristicas (ejemplo color) como en mercado libre */}
                  {/* bueno al final lo arreglé sacandole el $oid del _id (vonviendo string lo que volvia del back en view_product) y con esto el boton funciona normalmente peeeeeero quizas no estaria mal permitirle a usuario poner mas de un mismo producto con diferentes caracteristicas*/}
              </div>
          </div>
      </div>


    </div>
  );
}

export default ProductoDetail;
