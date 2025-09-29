def validar_producto(data, is_update=False):
    errores = {}

    # Nombre obligatorio solo en create
    if not is_update and not data.get("nombre_producto"):
        errores["nombre_producto"] = "El nombre es obligatorio"
    elif "nombre_producto" in data and len(data["nombre_producto"].strip()) == 0:
        errores["nombre_producto"] = "El nombre no puede estar vacío"

    # Precio
    if not is_update and "precio_venta" not in data:
        errores["precio_venta"] = "El precio es obligatorio"
    elif "precio_venta" in data:
        try:
            precio = float(data["precio_venta"])
            if precio <= 0:
                errores["precio_venta"] = "El precio debe ser mayor que 0"
        except (ValueError, TypeError):
            errores["precio_venta"] = "El precio debe ser un número válido"

    # Categoría
    if not is_update and not data.get("categoria"):
        errores["categoria"] = "La categoría es obligatoria"

    # Imágenes (si viene, validar que sea lista de strings)
    if "imagenes" in data and not all(isinstance(img, str) for img in data["imagenes"]):
        errores["imagenes"] = "Todas las imágenes deben ser URLs válidas"

    return errores
