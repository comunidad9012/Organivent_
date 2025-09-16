from flask_pymongo import PyMongo
from flask import Response, current_app, jsonify, send_from_directory
from bson import json_util
from bson.objectid import ObjectId

class ImagesModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)
    
    def save_image_db(self, filename, file_url, producto_id=None):
        """
        Guarda el documento en la colección Imagenes y devuelve el _id insertado (string).
        """
        try:
            doc = {'filename': filename, 'url': file_url}
            if producto_id:
                # opcional: guardar referencia al producto
                try:
                    doc['producto_id'] = ObjectId(producto_id)
                except:
                    doc['producto_id'] = producto_id
            result = self.mongo.db.Imagenes.insert_one(doc)
            return str(result.inserted_id)
        except Exception as e:
            current_app.logger.exception("Error guardando imagen en DB")
            raise

    def show_gallery(self):
        images=list(self.mongo.db.Imagenes.find().sort('_id', -1))
        for item in images:
            item['_id'] = str(item['_id'])
        response=json_util.dumps(images)
        return Response(response, mimetype="application/json")