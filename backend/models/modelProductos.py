from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
from bson.errors import InvalidId
import re
    
class ProductosModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def _normalize_image_ids(self, imagenes):
        if not imagenes:
            return []
        normalized = []
        for img in imagenes:
            try:
                if isinstance(img, dict) and "_id" in img:
                    normalized.append(ObjectId(img["_id"]))
                elif isinstance(img, str):
                    normalized.append(ObjectId(img))
            except:
                continue  # ignora valores inválidos
        return normalized


    def create_Productos(self, data):
        print("Datos recibidos en backend:", data)

        if 'nombre_producto' in data:
            raw_images = data.get('imagenes') or []
            imagenes_objids = self._normalize_image_ids(raw_images)

            categoria_id = data.get('categoria_id')
            if not categoria_id:
                return {"error": "categoria_id es requerido"}, 400

            try:
                categoria_id = ObjectId(categoria_id)
            except InvalidId:
                return {"error": "categoria_id inválido"}, 400

            Productos_data = {
                'nombre_producto': data['nombre_producto'],
                'descripcion': data.get('descripcion', ''),
                'precio_venta': data.get('precio_venta', 0),
                'categoria_id': categoria_id,
                'imagenes': imagenes_objids,
                'colores': data.get('colores', [])
            }

            result = self.mongo.db.Productos.insert_one(Productos_data)
            return {"contenido": "exitoso", "_id": str(result.inserted_id)}
        else:
            return {"contenido": "no funciona"}


    def delete_product_by_id(self, product_id):
        try:
            result = self.mongo.db.Productos.delete_one({"_id": ObjectId(product_id)})  # Convierte a ObjectId
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error al eliminar el producto: {e}")
            return False


    def show_Productos(self):
        productos = list(self.mongo.db.Productos.aggregate([
            {
                "$lookup": {
                    "from": "Imagenes",
                    "localField": "imagenes",
                    "foreignField": "_id",
                    "as": "imagenes"
                }
            },
            { "$sort": { "_id": -1 } }
        ]))

        # serializar ObjectIds a string
        for item in productos:
            item["_id"] = str(item["_id"])
            item["categoria_id"] = str(item.get("categoria_id")) if item.get("categoria_id") else None
            for img in item.get("imagenes", []):
                img["_id"] = str(img["_id"])

        return Response(json_util.dumps(productos), mimetype="application/json")


    # def specific_product(self,id):
    #     producto=self.mongo.db.Productos.find_one({'_id': ObjectId(id), })
    #     if not producto:
    #         return Response(json_util.dumps({"error": "Producto no encontrado"}), mimetype="application/json", status=404)
    #     producto['_id'] = str(producto['_id'])
    #     return Response(json_util.dumps(producto), mimetype="application/json")

    def specific_product(self, id):
        pipeline = [
            { "$match": { "_id": ObjectId(id) } },
            {
                "$lookup": {
                    "from": "Imagenes",        # colección de imágenes
                    "localField": "imagenes",  # en Productos: lista de ObjectIds
                    "foreignField": "_id",     # en Imagenes: campo _id
                    "as": "imagenes"           # sobrescribe el array con docs completos
                }
            }
        ]

        result = list(self.mongo.db.Productos.aggregate(pipeline))
        if not result:
            return None

        producto = result[0]

        # Serializar ids a string
        producto["_id"] = str(producto["_id"])
        producto["categoria_id"] = str(producto.get("categoria_id")) if producto.get("categoria_id") else None
        for img in producto.get("imagenes", []):
            img["_id"] = str(img["_id"])

        return producto

    
    def find_Productos(self, palabra):
        regex = re.compile(f".*{re.escape(palabra)}.*", re.IGNORECASE)
        Productos = list(self.mongo.db.Productos.find({
            "$or": [
                {"nombre_producto": regex}, #aca seguro cambia tambien
                {"noticia": regex} #serà descripcion aca? ESTOS SON LOS QUE BUSCAN NUNCA LO PROBE (importacion re)
            ]
        }).sort('_id', -1))
        
        for item in Productos:
            item['_id'] = str(item['_id'])
        
        response = json_util.dumps(Productos)
        return Response(response, mimetype="application/json")


    def get_productos_by_categoria(self, id_categoria):
        pipeline = [
            { "$match": { "categoria_id": ObjectId(id_categoria) } },
            {
                "$lookup": {
                    "from": "Imagenes",
                    "localField": "imagenes",
                    "foreignField": "_id",
                    "as": "imagenes"
                }
            }
        ]

        productos = list(self.mongo.db.Productos.aggregate(pipeline))

        for producto in productos:
            producto["_id"] = str(producto["_id"])
            producto["categoria_id"] = str(producto["categoria_id"])
            for img in producto.get("imagenes", []):
                img["_id"] = str(img["_id"])

        return Response(json_util.dumps(productos), mimetype="application/json")


    def update_product(self, product_id, data):
        try:
            update_fields = {}

            if 'nombre_producto' in data:
                update_fields['nombre_producto'] = data['nombre_producto']
            if 'descripcion' in data:
                update_fields['descripcion'] = data['descripcion']
            if 'precio_venta' in data:
                update_fields['precio_venta'] = data['precio_venta']
            if 'colores' in data:
                update_fields['colores'] = data['colores']
            if 'imagenes' in data:
                # convertir a ObjectId list
                imagenes_objids = self._normalize_image_ids(data['imagenes'])
                update_fields['imagenes'] = imagenes_objids
            if 'categoria' in data:
                update_fields['categoria'] = data['categoria']

            result = self.mongo.db.Productos.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_fields}
            )

            if result.matched_count > 0:
                return {"message": "Producto actualizado con éxito"}, 200
            else:
                return {"error": "No se encontró el producto"}, 404

        except Exception as e:
            print(f"Error al actualizar el producto: {e}")
            return {"error": "Error interno del servidor"}, 500


    def get_favoritos(self, user_id):
        favoritos = list(self.mongo.db.Favoritos.find({"user_id": user_id}))
        
        # Sacamos los IDs de productos
        product_ids = [ObjectId(f["product_id"]) for f in favoritos]

        # Buscamos los productos en la colección Productos + imágenes
        productos = list(self.mongo.db.Productos.aggregate([
            {"$match": {"_id": {"$in": product_ids}}},
            {"$lookup": {
                "from": "Imagenes",
                "localField": "imagenes",
                "foreignField": "_id",
                "as": "imagenes"
            }}
        ]))

        # Serializar ids
        for p in productos:
            p["_id"] = str(p["_id"])
            if p.get("categoria_id"):
                p["categoria_id"] = str(p["categoria_id"])
            for img in p.get("imagenes", []):
                img["_id"] = str(img["_id"])

        return productos


    def toggle_favorito(self, user_id, product_id):
        favoritos_col = self.mongo.db.Favoritos

        # ¿Ya existe el favorito?
        existente = favoritos_col.find_one({"user_id": user_id, "product_id": product_id})

        if existente:
            # Si existe → eliminar
            favoritos_col.delete_one({"_id": existente["_id"]})
            return {"message": "Producto eliminado de favoritos", "isFavorito": False}
        else:
            # Si no existe → agregar
            favoritos_col.insert_one({
                "user_id": user_id,
                "product_id": product_id
            })
            return {"message": "Producto agregado a favoritos", "isFavorito": True}


    def is_favorito(self, user_id, product_id):
        favoritos_col = self.mongo.db.Favoritos
        favorito = favoritos_col.find_one({"user_id": user_id, "product_id": product_id})
        return {"isFavorito": favorito is not None}
