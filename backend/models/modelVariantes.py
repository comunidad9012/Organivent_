from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from utils.serializers import serialize_doc

class VariantesModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_variante(self, data):
        variante_data = {
            "producto_id": ObjectId(data["producto_id"]),
            "atributos": data.get("atributos", {})
        }
        result = self.mongo.db.Variantes.insert_one(variante_data)

        variante_data["_id"] = result.inserted_id
        return serialize_doc(variante_data)

    def get_variantes_by_producto(self, producto_id):
        return list(self.mongo.db.Variantes.find({"producto_id": ObjectId(producto_id)}))
