from flask import Blueprint, request, current_app, jsonify
from models.modelStock import StockModel
from bson import ObjectId
from utils.serializers import serialize_doc

Stock_bp = Blueprint('Stock', __name__, url_prefix='/Stock')

@Stock_bp.post("/create")
def create_stock():
    data = request.json
    model = StockModel(current_app)
    stock = model.create_stock(data)

    if "_id" in stock and isinstance(stock["_id"], ObjectId):
        stock["_id"] = str(stock["_id"])

    return jsonify(stock), 201

@Stock_bp.get("/by_variante/<variante_id>")
def get_stock_by_variante(variante_id):
    model = StockModel(current_app)
    stock = model.get_stock_by_variante(variante_id)
    if stock:
        return jsonify(serialize_doc(stock)), 200
    return jsonify({"error": "Stock no encontrado"}), 404


@Stock_bp.put("/update/<stock_id>")
def update_stock(stock_id):
    data = request.json
    model = StockModel(current_app)
    stock_actualizado = model.update_stock(stock_id, data)

    if not stock_actualizado:
        return jsonify({"error": "Stock no encontrado"}), 404

    if "_id" in stock_actualizado and isinstance(stock_actualizado["_id"], ObjectId):
        stock_actualizado["_id"] = str(stock_actualizado["_id"])

    return jsonify(stock_actualizado), 200

