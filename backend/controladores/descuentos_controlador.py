from flask import Blueprint, request, current_app, jsonify
from models.modelDescuentos import Descuento

Descuentos_bp = Blueprint("Descuentos", __name__, url_prefix="/Descuentos")


# Crear un descuento
@Descuentos_bp.post("/createDescuento")
def create_descuento():
    data = request.json
    if not data:
        return jsonify({"error": "Se requieren datos"}), 400

    try:
        descuento_model = Descuento(current_app)
        inserted_id = descuento_model.crear_descuento(data)
        return jsonify({"message": "Descuento creado con éxito", "id": inserted_id}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear el descuento: {str(e)}"}), 500

# Obtener todos los descuentos con detalles de productos y categorías
@Descuentos_bp.get("/showDescuentos")
def show_descuentos_con_detalles():
    descuento_model = Descuento(current_app)
    descuentos = descuento_model.obtener_todos_con_detalles() #esto es lo unico que lo diferencia

    # Convertir ObjectId y fechas
    for d in descuentos:
        d["_id"] = str(d["_id"])
        if "fecha_inicio" in d and d["fecha_inicio"]:
            d["fecha_inicio"] = d["fecha_inicio"].isoformat()
        if "fecha_fin" in d and d["fecha_fin"]:
            d["fecha_fin"] = d["fecha_fin"].isoformat()

    return jsonify(descuentos), 200

# Obtener solo descuentos activos
@Descuentos_bp.get("/activos")
def descuentos_activos():
    descuento_model = Descuento(current_app)
    activos = descuento_model.obtener_descuentos_activos()

    for d in activos:
        d["_id"] = str(d["_id"])
        if "fecha_inicio" in d and d["fecha_inicio"]:
            d["fecha_inicio"] = d["fecha_inicio"].isoformat()
        if "fecha_fin" in d and d["fecha_fin"]:
            d["fecha_fin"] = d["fecha_fin"].isoformat()

    return jsonify(activos), 200


# Eliminar un descuento
@Descuentos_bp.delete("/deleteDescuentos/<id>")
def delete_descuento(id):
    descuento_model = Descuento(current_app)
    if descuento_model.eliminar(id):
        return jsonify({"message": "Descuento eliminado con éxito"}), 200
    else:
        return jsonify({"error": "Descuento no encontrado"}), 404


@Descuentos_bp.get("/viewDiscount/<id>")
def specific_discount(id):
    descuento_model = Descuento(current_app)
    descuento = descuento_model.get_discount_by_id(id)
    # print("FUNCIONOOOO esto trae del descuento: ", descuento)

    if not descuento:
        return jsonify({"error": "Descuento no encontrado"}), 404

    return jsonify(descuento), 200


# controlador descuentos
@Descuentos_bp.put("/update/<id>")
def update_descuento(id):
    data = request.json
    descuento_model = Descuento(current_app)

    actualizado = descuento_model.actualizar(id, data)
    if actualizado:
        return jsonify({"message": "Descuento actualizado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el descuento"}), 404

