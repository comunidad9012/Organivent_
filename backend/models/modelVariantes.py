from flask_pymongo import PyMongo
from bson.objectid import ObjectId

class VariantesModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_variante(self, data):
        variante_data = {
            "producto_id": data["producto_id"],   # id del producto
            "atributos": data.get("atributos", {})  # ej: { "color": "rojo", "tamaño": "M" }
        }
        result = self.mongo.db.Variantes.insert_one(variante_data)
        return {"_id": str(result.inserted_id), **variante_data}

    def get_variante(self, variante_id):
        variante = self.mongo.db.Variantes.find_one({"_id": ObjectId(variante_id)})
        if not variante:
            return None
        variante["_id"] = str(variante["_id"])
        return variante

    def get_variantes_by_producto(self, producto_id):
        variantes = list(self.mongo.db.Variantes.find({"producto_id": producto_id}))
        for v in variantes:
            v["_id"] = str(v["_id"])
        return variantes
