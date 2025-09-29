def validar_descuento(descuento):
    """
    Valida y normaliza un descuento antes de aplicarlo.
    - Si es porcentaje: lo convierte a fracción (20 -> 0.20) y exige 1-99%.
    - Si es monto: exige que sea mayor a 0.
    """
    tipo = descuento.get("tipo")
    valor = float(descuento.get("valor", 0))

    if tipo == "porcentaje":
        if not (1 <= valor <= 99):
            raise ValueError("El porcentaje debe estar entre 1 y 99")
        # Guardamos como fracción
        descuento["valor"] = valor / 100.0
        descuento["_valor_humano"] = valor  # 👈 guardamos el original para mostrar

    elif tipo == "monto":
        if valor <= 0:
            raise ValueError("El monto fijo debe ser mayor que 0")
        descuento["valor"] = valor

    return descuento


def aplicar_descuentos_a_productos(productos, descuentos):
    # Normalizamos primero
    descuentos_normalizados = [validar_descuento(d.copy()) for d in descuentos]

    descuentos_por_producto = {}
    descuentos_por_categoria = {}

    for d in descuentos_normalizados:
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
        
        d = None
        if p["_id"] in descuentos_por_producto:
            d = descuentos_por_producto[p["_id"]]
        elif p["categoria"] in descuentos_por_categoria:
            d = descuentos_por_categoria[p["categoria"]]

        if d:
            if d["tipo"] == "porcentaje":
                precio_final = precio_original * (1 - d["valor"])
            elif d["tipo"] == "monto":
                precio_final = max(precio_original - d["valor"], 0)
            descuento_aplicado = d

        p["precio_original"] = round(precio_original, 2)
        p["precio_final"] = round(precio_final, 2)

        if descuento_aplicado:
            p["descuento_aplicado"] = {
                "nombre": descuento_aplicado["nombre"],
                "tipo": descuento_aplicado["tipo"],
                "valor": (
                    descuento_aplicado["_valor_humano"]
                    if descuento_aplicado["tipo"] == "porcentaje"
                    else descuento_aplicado["valor"]
                )
            }

        productos_actualizados.append(p)

    return productos_actualizados
