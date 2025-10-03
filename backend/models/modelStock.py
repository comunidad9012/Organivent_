from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from utils.serializers import serialize_doc

class StockModel:
    def __init__(self, app_or_mongo):
        if isinstance(app_or_mongo, PyMongo):
            self.mongo = app_or_mongo  # ya es instancia de PyMongo
        else:
            self.mongo = PyMongo(app_or_mongo)  # recibe un Flask app

    def create_stock(self, data):
        try:
            stock_data = {
                "variante_id": ObjectId(data["variante_id"]),
                "cantidad": int(data["cantidad"])
            }
            result = self.mongo.db.Stock.insert_one(stock_data)
            stock_data["_id"] = result.inserted_id
            return serialize_doc(stock_data)
        except Exception as e:
            return {"error": str(e)}

    def get_stock_by_variante(self, variante_id):
        return self.mongo.db.Stock.find_one({"variante_id": ObjectId(variante_id)})


    def update_stock(self, stock_id, data):
        result = self.mongo.db.Stock.update_one(
            {"_id": ObjectId(stock_id)},
            {"$set": {"cantidad": int(data.get("cantidad", 0))}}
        )
        if result.matched_count:
            return self.mongo.db.Stock.find_one({"_id": ObjectId(stock_id)})
        return None

    def decrease_stock(self, variante_id, cantidad):
        result = self.mongo.db.Stock.update_one(
            {"variante_id": ObjectId(variante_id)},
            {"$inc": {"cantidad": -int(cantidad)}}
        )
        if result.matched_count:
            return self.mongo.db.Stock.find_one({"variante_id": ObjectId(variante_id)})
        return None

