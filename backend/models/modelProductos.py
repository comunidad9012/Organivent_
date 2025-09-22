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
            if isinstance(img, dict):
                # si ya viene {_id, url}, lo guardamos así
                normalized.append(img)
            elif isinstance(img, str):
                try:
                    normalized.append({"_id": ObjectId(img)})
                except:
                    normalized.append({"_id": img})
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
        productos = list(self.mongo.db.Productos.find().sort('_id', -1))
        for item in productos:
            item['_id'] = str(item['_id'])
            item['categoria_id'] = str(item.get('categoria_id')) if item.get('categoria_id') else None

            image_refs = item.get('imagenes', [])
            image_ids = []
            for ref in image_refs:
                if isinstance(ref, dict) and '_id' in ref:
                    try:
                        image_ids.append(ObjectId(ref['_id']))
                    except:
                        pass
                elif isinstance(ref, str):
                    try:
                        image_ids.append(ObjectId(ref))
                    except:
                        pass

            if image_ids:
                imgs = list(self.mongo.db.Imagenes.find({'_id': {'$in': image_ids}}))
                for img in imgs:
                    img['_id'] = str(img['_id'])
                item['imagenes'] = imgs
            else:
                item['imagenes'] = []

        response = json_util.dumps(productos)
        return Response(response, mimetype="application/json")

    # def specific_product(self,id):
    #     producto=self.mongo.db.Productos.find_one({'_id': ObjectId(id), })
    #     if not producto:
    #         return Response(json_util.dumps({"error": "Producto no encontrado"}), mimetype="application/json", status=404)
    #     producto['_id'] = str(producto['_id'])
    #     return Response(json_util.dumps(producto), mimetype="application/json")

    def specific_product(self, id):
        producto = self.mongo.db.Productos.find_one({'_id': ObjectId(id)})
        if not producto:
            return None
        producto['_id'] = str(producto['_id'])
        producto['categoria_id'] = str(producto.get('categoria_id')) if producto.get('categoria_id') else None

        image_ids = producto.get('imagenes', [])
        if image_ids:
            imgs = list(self.mongo.db.Imagenes.find({'_id': {'$in': image_ids}}))
            for img in imgs:
                img['_id'] = str(img['_id'])
            producto['imagenes'] = imgs
        else:
            producto['imagenes'] = []

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
        productos = list(self.mongo.db.Productos.find({"categoria_id": ObjectId(id_categoria)}))
        for producto in productos:
            producto['_id'] = str(producto['_id'])
            producto['categoria_id'] = str(producto['categoria_id'])  # serializar
            # resolver imágenes
            image_ids = producto.get('imagenes', [])
            if image_ids:
                imgs = list(self.mongo.db.Imagenes.find({'_id': {'$in': image_ids}}))
                for img in imgs:
                    img['_id'] = str(img['_id'])
                producto['imagenes'] = imgs
            else:
                producto['imagenes'] = []
        response=json_util.dumps(productos)
        return Response(response, mimetype="application/json")

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
        favoritos_col = self.mongo.db.Favoritos
        productos_col = self.mongo.db.Productos

        # Buscar los IDs de productos favoritos del usuario
        favoritos = list(favoritos_col.find({"user_id": user_id}))
        product_ids = [ObjectId(f["product_id"]) for f in favoritos]

        if not product_ids:
            return []

        # Buscar los productos en la colección Productos
        productos = list(productos_col.find({"_id": {"$in": product_ids}}))

        for p in productos:
            p["_id"] = str(p["_id"])
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
