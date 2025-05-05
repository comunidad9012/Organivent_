import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CartProduct from './CartProduct';
import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";
// import { Radio, RadioGroup } from '@headlessui/react'

function ProductoDetail() {
  const [Producto, setProducto] = useState({});
  const { id } = useParams();

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
              <p className="text-xl text-primary">${Producto.precio_venta}</p>
              <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★★★★☆</span>
                  {/* VER ESTO DE LAS ESTRELLAS MAS ADELANTE */}
              </div>  

              <div dangerouslySetInnerHTML={{ __html: Producto.descripcion }} className="mt-2 mr-5 text-muted-foreground"/>
              {/* <p className="mt-2 text-muted-foreground">
                  The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.
              </p> */}
              <div className="mt-4">
                  <span className="block text-muted-foreground">Color:</span>
                  <div className="flex space-x-2">
                      <button className="w-8 h-8 rounded bg-zinc-300"></button>
                      <button className="w-8 h-8 rounded-full bg-zinc-800"></button>
                  </div>
              </div>


              {/* <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center gap-x-3">
                    {Producto.colors.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        aria-label={color.name}
                        className={classNames(
                          color.selectedClass,
                          'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-hidden data-checked:ring-2 data-focus:data-checked:ring-3 data-focus:data-checked:ring-offset-1',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(color.class, 'size-8 rounded-full border border-black/10')}
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div> */}

    
              <div className="flex flex-col justify-end mt-4">
              
              {userState.rol === Roles.USER && (
                <CartProduct product={Producto}/>
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
