from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

class PedidosModel:
    ESTADOS_VALIDOS = ["Pendiente", "Aceptado", "Listo", "Cancelado", "Entregado"]
    
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_pedido(self, data):
        if 'usuarioId' in data and 'productos' in data and data['productos']:
            pedido_data = {
                'usuarioId': data['usuarioId'],
                'productos': data['productos'],  # lista de productos con cantidad
                'total': data.get('total', 0),
                'estado': 'Pendiente',  # por defecto
                'fecha': datetime.now()
            }
            self.mongo.db.Pedidos.insert_one(pedido_data)
            return {"mensaje": "Pedido creado exitosamente"}
        else:
            return {"error": "Datos insuficientes para crear el pedido"}

    # def show_pedidos(self):
    #     pedidos = list(self.mongo.db.Pedidos.find().sort('_id', -1))
    #     for item in pedidos:
    #         item['_id'] = str(item['_id'])
    #     response = json_util.dumps(pedidos)
    #     return Response(response, mimetype="application/json")

    def show_pedidos(self):
        pedidos = list(self.mongo.db.Pedidos.find().sort('_id', -1))
        for pedido in pedidos:
            pedido['_id'] = str(pedido['_id'])

            # Agregar nombre y email de usuario
            usuario = self.mongo.db.Clientes.find_one({"_id": ObjectId(pedido["usuarioId"])})
            pedido["usuarioNombre"] = usuario["nombre"] if usuario else "Usuario no encontrado"
            pedido["usuarioEmail"] = usuario["email"] if usuario else "Email no encontrado"

            # Agregar nombre de producto a cada producto en el pedido
            for prod in pedido.get("productos", []):
                producto = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
                prod["productoNombre"] = producto["nombre_producto"] if producto else "Producto no encontrado"
                prod["productoId"] = str(prod["productoId"])  # para mantener todo serializable

        response = json_util.dumps(pedidos)
        return Response(response, mimetype="application/json")



    def get_pedido_by_id(self, pedido_id):
        try:
            pedido = self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
            if not pedido:
                return {"error": "Pedido no encontrado"}, 404

            pedido['_id'] = str(pedido['_id'])

            # Agregar nombre y email de usuario
            usuario = self.mongo.db.Clientes.find_one({"_id": ObjectId(pedido["usuarioId"])})
            pedido["usuarioNombre"] = usuario["nombre"] if usuario else "Usuario no encontrado"
            pedido["usuarioEmail"] = usuario["email"] if usuario else "Email no encontrado"

            # Agregar nombre del producto a cada item del pedido
            for prod in pedido.get("productos", []):
                producto = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
                prod["productoNombre"] = producto["nombre_producto"] if producto else "Producto no encontrado"
                prod["productoId"] = str(prod["productoId"])  # hacer serializable

            response = json_util.dumps(pedido)
            return Response(response, mimetype="application/json")
        
        except Exception as e:
            return {"error": f"Error al obtener el pedido: {str(e)}"}, 500


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

    def update_state(self, pedido_id, nuevo_estado):
        if nuevo_estado not in self.ESTADOS_VALIDOS:
            raise ValueError("Estado no reconocido.")

        pedido = self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
        if not pedido:
            raise ValueError("Pedido no encontrado.")

        result = self.mongo.db.Pedidos.update_one(
            {"_id": ObjectId(pedido_id)},
            {"$set": {"estado": nuevo_estado}}
        )

        if result.modified_count == 0:
            raise ValueError("El estado no fue modificado.")
