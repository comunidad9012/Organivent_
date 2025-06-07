from flask_pymongo import PyMongo
from flask import Response, current_app, jsonify, send_from_directory
from bson import json_util
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename

class ImagesModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)
    
    def save_image_db(self,filename,file_url):
        try:
            print(filename,file_url)
            self.mongo.db.images.insert_one({'filename': filename, 'url': file_url}) #esto es para arrancar con la galeria de imagenes
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def show_gallery(self):
        images=list(self.mongo.db.images.find().sort('_id', -1))
        for item in images:
            item['_id'] = str(item['_id'])
        response=json_util.dumps(images)
        return Response(response, mimetype="application/json")