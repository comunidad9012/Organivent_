from flask_pymongo import PyMongo
from bson.objectid import ObjectId

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

            return {
                "_id": str(result.inserted_id),
                "variante_id": str(stock_data["variante_id"]),
                "cantidad": stock_data["cantidad"]
            }
        except Exception as e:
            return {"error": str(e)}

    def get_stock_by_variante(self, variante_id):
        return self.mongo.db.Stock.find_one({"variante_id": ObjectId(variante_id)})
