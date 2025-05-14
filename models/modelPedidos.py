from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

class PedidosModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_pedido(self, data):
        if 'usuarioId' in data and 'productos' in data and data['productos']:
            pedido_data = {
                'usuarioId': data['usuarioId'],
                'productos': data['productos'],  # lista de productos con cantidad
                'total': data.get('total', 0),
                'estado': 'pendiente',  # por defecto
                'fecha': datetime.now()
            }
            self.mongo.db.Pedidos.insert_one(pedido_data)
            return {"mensaje": "Pedido creado exitosamente"}
        else:
            return {"error": "Datos insuficientes para crear el pedido"}

    def show_pedidos(self):
        pedidos = list(self.mongo.db.Pedidos.find().sort('_id', -1))
        for item in pedidos:
            item['_id'] = str(item['_id'])
        response = json_util.dumps(pedidos)
        return Response(response, mimetype="application/json")


    # def show_pedidos(self):
    #     pedidos = self.pedidos_collection.find()
    #     lista_pedidos = []
    #     for pedido in pedidos:
    #         pedido['_id'] = str(pedido['_id'])
    #         pedido['usuarioId'] = str(pedido['usuarioId'])  # Por si querés mostrarlo
    #         lista_pedidos.append(pedido)
    #     return jsonify(lista_pedidos), 200



    def get_pedido_by_id(self, pedido_id):
        pedido = self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
        if pedido:
            pedido['_id'] = str(pedido['_id'])
            response = json_util.dumps(pedido)
            return Response(response, mimetype="application/json")
        else:
            return {"error": "Pedido no encontrado"}, 404

    def delete_pedido(self, pedido_id):
        try:
            result = self.mongo.db.Pedidos.delete_one({"_id": ObjectId(pedido_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error al eliminar el pedido: {e}")
            return False

    def update_pedido(self, pedido_id, data):
        try:
            result = self.mongo.db.Pedidos.update_one(
                {"_id": ObjectId(pedido_id)},
                {"$set": data}
            )
            if result.matched_count > 0:
                return {"mensaje": "Pedido actualizado con éxito"}, 200
            else:
                return {"error": "No se encontró el pedido"}, 404
        except Exception as e:
            print(f"Error al actualizar el pedido: {e}")
            return {"error": "Error interno"}, 500
