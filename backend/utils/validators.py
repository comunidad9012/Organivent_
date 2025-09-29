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

    # Categoría (usar categoria_id)
    if not is_update and not data.get("categoria_id"):
        errores["categoria_id"] = "La categoría es obligatoria"

    # Imágenes
    if "imagenes" in data:
        if not isinstance(data["imagenes"], list):
            errores["imagenes"] = "El campo imágenes debe ser una lista"
        else:
            for img in data["imagenes"]:
                if not (isinstance(img, dict) and "_id" in img) and not isinstance(img, str):
                    errores["imagenes"] = "Formato de imágenes inválido"
                    break

    return errores
