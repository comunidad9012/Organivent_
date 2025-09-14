from flask import Blueprint, request, current_app, jsonify
from bson import ObjectId
from models.modelVariantes import VariantesModel

Variantes_bp = Blueprint('Variantes', __name__, url_prefix='/Variantes')

@Variantes_bp.post("/create")
def create_variante():
    data = request.json
    model = VariantesModel(current_app) 
    variante = model.create_variante(data)

    # Convertir ObjectId a str si existe
    if "_id" in variante and isinstance(variante["_id"], ObjectId):
        variante["_id"] = str(variante["_id"])

    return jsonify(variante), 201

@Variantes_bp.get("/by_producto/<producto_id>")
def get_variantes_by_producto(producto_id):
    model = VariantesModel(current_app)
    variantes = model.get_variantes_by_producto(producto_id)
    return jsonify(variantes), 200

