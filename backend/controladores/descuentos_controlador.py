from flask import Blueprint, request, current_app, jsonify
from models.modelDescuentos import Descuento
from datetime import datetime

Descuentos_bp = Blueprint("Descuentos", __name__, url_prefix="/Descuentos")

# Crear un descuento
@Descuentos_bp.post("/createDescuento")
def create_descuento():
    data = request.json
    if not data:
        return jsonify({"error": "Se requieren datos para crear el descuento"}), 400

    try:
        # productos y categorias se guardan como strings (no ObjectId)
        productos = [str(p) for p in data.get("productos", [])]
        categorias = [str(c) for c in data.get("categorias", [])]

        # convertir fechas ISO a datetime (Mongo luego las guarda como $date)
        fecha_inicio = datetime.fromisoformat(data["fecha_inicio"].replace("Z", "+00:00")) if "fecha_inicio" in data else None
        fecha_fin = datetime.fromisoformat(data["fecha_fin"].replace("Z", "+00:00")) if "fecha_fin" in data else None

        # documento final como el de tu DB
        descuento_doc = {
            "nombre": data.get("nombre"),
            "tipo": data.get("tipo"),
            "valor": float(data.get("valor", 0)),
            "productos": productos,
            "categorias": categorias,
            "activo": data.get("activo", True),
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
        }

        descuento_model = Descuento(current_app)
        result = descuento_model.mongo.db.descuentos.insert_one(descuento_doc)

        return jsonify({
            "message": "Descuento creado con éxito",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": f"Error al crear el descuento: {str(e)}"}), 500



# Obtener todos los descuentos
@Descuentos_bp.get("/showDescuentos")
def show_descuentos():
    descuento_model = Descuento(current_app)
    descuentos = list(descuento_model.mongo.db.descuentos.find({}))
    
    # Convertir ObjectId y fechas a string para enviar al frontend
    for d in descuentos:
        d["_id"] = str(d["_id"])
        if "fecha_inicio" in d:
            d["fecha_inicio"] = d["fecha_inicio"].isoformat()
        if "fecha_fin" in d:
            d["fecha_fin"] = d["fecha_fin"].isoformat()
    return jsonify(descuentos), 200


# Obtener solo descuentos activos
@Descuentos_bp.get("/activos")
def descuentos_activos():
    descuento_model = Descuento(current_app)
    activos = descuento_model.obtener_descuentos_activos()
    for d in activos:
        d["_id"] = str(d["_id"])
    return jsonify(activos)


# Eliminar un descuento por id
@Descuentos_bp.delete("/delete/<id>")
def delete_descuento(id):
    from bson.objectid import ObjectId
    descuento_model = Descuento(current_app)
    result = descuento_model.mongo.db.descuentos.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Descuento eliminado con éxito"}), 200
    else:
        return jsonify({"error": "Descuento no encontrado"}), 404


# Actualizar un descuento por id
@Descuentos_bp.put("/update/<id>")
def update_descuento(id):
    from bson.objectid import ObjectId
    data = request.json
    descuento_model = Descuento(current_app)
    result = descuento_model.mongo.db.descuentos.update_one(
        {"_id": ObjectId(id)}, {"$set": data}
    )
    if result.matched_count == 1:
        return jsonify({"message": "Descuento actualizado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el descuento"}), 404
