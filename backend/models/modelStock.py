from flask_pymongo import PyMongo
from bson.objectid import ObjectId

class StockModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_stock(self, data):
        stock_data = {
            "variante_id": data["variante_id"],
            "cantidad": int(data["cantidad"])
        }
        result = self.mongo.db.Stock.insert_one(stock_data)
        return {"_id": str(result.inserted_id), **stock_data}

    def get_stock_by_variante(self, variante_id):
        stock = self.mongo.db.Stock.find_one({"variante_id": variante_id})
        if not stock:
            return None
        stock["_id"] = str(stock["_id"])
        return stock
