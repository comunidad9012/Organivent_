from flask import Blueprint, request, current_app, jsonify
from bson import ObjectId
from models.modelVariantes import VariantesModel
from utils.serializers import serialize_doc

Variantes_bp = Blueprint('Variantes', __name__, url_prefix='/Variantes')

@Variantes_bp.post("/create")
def create_variante():
    data = request.json
    print("📥 Datos recibidos en /Variantes/create:", data, flush=True)
    model = VariantesModel(current_app) 
    variante = model.create_variante(data)
    print("✅ Variante creada en Mongo:", variante, flush=True)

    # Convertir ObjectId a str si existe
    if "_id" in variante and isinstance(variante["_id"], ObjectId):
        variante["_id"] = str(variante["_id"])

    return jsonify(variante), 201

@Variantes_bp.get("/by_producto/<producto_id>")
def get_variantes_by_producto(producto_id):
    model = VariantesModel(current_app)
    variantes = model.get_variantes_by_producto(producto_id)
    variantes = [serialize_doc(v) for v in variantes]
    return jsonify(variantes), 200


@Variantes_bp.put("/update/<variante_id>")
def update_variante(variante_id):
    data = request.json
    model = VariantesModel(current_app)
    variante_actualizada = model.update_variante(variante_id, data)

    if not variante_actualizada:
        return jsonify({"error": "Variante no encontrada"}), 404

    if "_id" in variante_actualizada and isinstance(variante_actualizada["_id"], ObjectId):
        variante_actualizada["_id"] = str(variante_actualizada["_id"])

    return jsonify(variante_actualizada), 200

@Variantes_bp.delete("/delete/<id>")
def delete_variante(id):
    model = VariantesModel(current_app)
    success = model.delete_variante(id)
    if success:
        return jsonify({"message": "Variante eliminada"}), 200
    return jsonify({"error": "Variante no encontrada"}), 404
