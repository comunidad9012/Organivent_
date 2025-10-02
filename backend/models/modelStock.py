from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from utils.serializers import serialize_doc

class StockModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

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
