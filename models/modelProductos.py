from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
import re
    
class ProductosModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_Productos(self, data):
        if 'nombre_producto' in data:
            Productos_data = {
                'nombre_producto':data['nombre_producto'], 
                'descripcion':data['descripcion'],
                'precio_venta':data['precio_venta'],
                #'stock':data['stock'],
                #'miniatura':data['miniatura']
                }
            self.mongo.db.Productos.insert_one(Productos_data)
            return {"contenido": "exitoso"}
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
        Productos=list(self.mongo.db.Productos.find().sort('_id', -1))
        for item in Productos:
            item['_id'] = str(item['_id'])
        response=json_util.dumps(Productos)
        return Response(response, mimetype="application/json")

    def specific_product(self,id):
        Productos=self.mongo.db.Productos.find_one({'_id': ObjectId(id), })
        response=json_util.dumps(Productos)
        return Response(response, mimetype="application/json")
    
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
        productos = list(self.mongo.db.Productos.find({"categoria": id_categoria})) #-------------aca va el id de la categoria no el nombre
        for producto in productos:
            producto['_id'] = str(producto['_id'])
        response=json_util.dumps(productos)
        return Response(response, mimetype="application/json") #añadi esto como el otro para que funcione

    def update_product(self, product_id, data):
        try:
            update_fields = {}

            if 'nombre_producto' in data:
                update_fields['nombre_producto'] = data['nombre_producto']
            if 'descripcion' in data:
                update_fields['descripcion'] = data['descripcion']
            if 'precio_venta' in data:
                update_fields['precio_venta'] = data['precio_venta']
            if 'miniatura' in data:
                update_fields['miniatura'] = data['miniatura']

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
