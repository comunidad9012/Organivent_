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

