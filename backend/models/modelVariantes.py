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


    def update_variante(self, variante_id, data):
        result = self.mongo.db.Variantes.update_one(
            {"_id": ObjectId(variante_id)},
            {"$set": {"atributos": data.get("atributos", {})}}
        )
        if result.matched_count:
            return self.mongo.db.Variantes.find_one({"_id": ObjectId(variante_id)})
        return None

    def delete_variante(self, id):
        res = self.mongo.db.Variantes.delete_one({"_id": ObjectId(id)})
        return res.deleted_count > 0

