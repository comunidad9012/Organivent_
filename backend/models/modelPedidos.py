from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

class PedidosModel:
    ESTADOS_VALIDOS = ["Pendiente", "Aceptado", "Listo para la entrega", "Cancelado", "Entregado"]

    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_pedido(self, data):
        if 'usuarioId' in data and 'productos' in data and data['productos']:
            productos_finales = []
            total = 0

            for prod in data['productos']:
                producto_db = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
                if not producto_db:
                    continue

                precio_original = float(prod.get("precio_original", 0))
                precio_final = float(prod.get("precio_final", precio_original))
                descuento = prod.get("descuento_aplicado")

                cantidad = prod.get("cantidad", 1)
                subtotal = precio_final * cantidad
                total += subtotal

                productos_finales.append({
                    "productoId": prod["productoId"],
                    "productoNombre": prod.get("nombre", producto_db.get("nombre_producto", "Producto sin nombre")),
                    "cantidad": cantidad,
                    "color": prod.get("color"),
                    "precio_original": precio_original,
                    "precio_final": precio_final,
                    "precio_unitario": precio_final,
                    "descuento_aplicado": descuento,
                    "subtotal": subtotal,
                    "imagenes": prod.get("imagenes", producto_db.get("imagenes", []))
                })

            pedido_data = {
                'usuarioId': data['usuarioId'],
                'cliente_nombre': data.get('cliente_nombre'),
                'cliente_email': data.get('cliente_email'),
                'productos': productos_finales,
                'total': total,
                'estado': 'Pendiente',
                'fecha': datetime.now()
            }

            result = self.mongo.db.Pedidos.insert_one(pedido_data)

            print("📧 cliente_email recibido:", data.get("cliente_email"))

            return {
                "mensaje": "Pedido creado exitosamente",
                "pedido_id": str(result.inserted_id),
                "cliente_email": pedido_data.get("cliente_email"),
                "cliente_nombre": pedido_data.get("cliente_nombre"),
                "total": total
            }
        else:
            return {"error": "Datos insuficientes para crear el pedido"}


    def show_pedidos(self):
        # Devuelve todos los pedidos (admin)
        pedidos = list(self.mongo.db.Pedidos.find().sort('_id', -1))
        return self._serialize_pedidos(pedidos)

    def show_pedidos_by_user(self, user_id):
        # Devuelve los pedidos de un usuario específico.
        pedidos = list(self.mongo.db.Pedidos.find({"usuarioId": user_id}).sort('_id', -1))
        return self._serialize_pedidos(pedidos)
    
    def _serialize_pedidos(self, pedidos):
        for pedido in pedidos:
            self._serialize_pedido(pedido)
        return Response(json_util.dumps(pedidos), mimetype="application/json")

    def _serialize_pedido(self, pedido):
        pedido['_id'] = str(pedido['_id'])
        pedido['usuarioId'] = str(pedido['usuarioId'])

        usuario = self.mongo.db.Clientes.find_one({"_id": ObjectId(pedido["usuarioId"])})
        pedido["usuarioNombre"] = usuario["nombre"] if usuario else "Usuario no encontrado"
        pedido["usuarioEmail"] = usuario["email"] if usuario else "Email no encontrado"

        for prod in pedido.get("productos", []):
            producto = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
            if producto:
                # Solo agrego info extra, sin tocar precios ya guardados en el pedido
                prod["productoNombre"] = producto.get("nombre_producto", "Producto sin nombre")
                prod["imagenes"] = producto.get("imagenes", [])
            else:
                prod["productoNombre"] = "Producto no encontrado"
                prod["imagenes"] = []

            # Asegurarse de que el id siempre sea string
            prod["productoId"] = str(prod["productoId"])

        return pedido



    def get_pedido_by_id_raw(self, pedido_id):
        #   Obtiene un pedido sin serializar (dict de Mongo) o None
        try:
            return self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
        except Exception:
            return None


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
