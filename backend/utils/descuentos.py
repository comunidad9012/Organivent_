def aplicar_descuentos_a_productos(productos, descuentos):
    descuentos_por_producto = {}
    descuentos_por_categoria = {}

    for d in descuentos:
        for pid in d.get("productos", []):
            descuentos_por_producto[str(pid)] = d
        for cat in d.get("categorias", []):
            descuentos_por_categoria[str(cat)] = d

    productos_actualizados = []

    for p in productos:
        precio_original = float(p.get("precio_venta", 0))
        p["_id"] = str(p["_id"])
        p["categoria"] = str(p.get("categoria", ""))

        precio_final = precio_original
        descuento_aplicado = None
# ---------------
        if p["_id"] in descuentos_por_producto:
            d = descuentos_por_producto[p["_id"]]
            if d["tipo"] == "porcentaje":
                precio_final = precio_original * (1 - d["valor"])
            elif d["tipo"] == "fijo":
                precio_final = max(precio_original - d["valor"], 0)
            descuento_aplicado = d
        elif p["categoria"] in descuentos_por_categoria:
            d = descuentos_por_categoria[p["categoria"]]
            if d["tipo"] == "porcentaje":
                precio_final = precio_original * (1 - d["valor"])
            elif d["tipo"] == "fijo":
                precio_final = max(precio_original - d["valor"], 0)
            descuento_aplicado = d
# ------------------    
        p["precio_original"] = round(precio_original, 2)
        p["precio_final"] = round(precio_final, 2)
        if descuento_aplicado:
            p["descuento_aplicado"] = {
                "nombre": descuento_aplicado["nombre"],
                "tipo": descuento_aplicado["tipo"],
                "valor": descuento_aplicado["valor"]
            }

        productos_actualizados.append(p)

    return productos_actualizados
