import os
from flask import Blueprint, request, current_app, jsonify, send_from_directory
from models.modelProductos import ProductosModel
from werkzeug.utils import secure_filename
from models.modelImgs import ImagesModel

imgs_bp = Blueprint('imgs', __name__, url_prefix='/imgs')

@imgs_bp.post('/upload')
def upload_file():
    if 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(f"{current_app.config['UPLOAD_FOLDER']}/{filename}") #cuando tenga mas tiempo, buscar una forma de que se suban solo las imagenes incluidas dentro de la noticia 
        file_url = f'http://localhost:5000/images/{filename}'
        img_model=ImagesModel(current_app)
        img_model.save_image_db(filename,file_url)
        return jsonify({'location': file_url})
    return jsonify({'error': 'No file part'}), 400

@imgs_bp.get('/gallery')
def gallery():
    img_model=ImagesModel(current_app)
    response=img_model.show_gallery()
    return response