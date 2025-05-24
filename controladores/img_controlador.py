import os
from flask import Blueprint, request, current_app, jsonify, send_from_directory, redirect
from werkzeug.utils import secure_filename
from models.modelProductos import ProductosModel
from models.modelImgs import ImagesModel
from utils.minio_client import upload_to_minio
from io import BytesIO


imgs_bp = Blueprint('imgs', __name__, url_prefix='/imgs')

@imgs_bp.post('/upload')
def upload_file():
    if 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)

        # Leer el archivo y prepararlo como stream para MinIO
        file_stream = BytesIO(file.read())

        # Subir a MinIO
        try:
            file_url = upload_to_minio(file_stream, filename, file.mimetype)

            # Guardar en MongoDB
            img_model = ImagesModel(current_app)
            img_model.save_image_db(filename, file_url)

            return jsonify({'location': f"http://localhost:5000/imgs/imagenes/{filename}"}), 200

        except Exception as e:
            print(f"Error al subir a MinIO: {e}")
            return jsonify({'error': 'Falló la subida a MinIO'}), 500

    return jsonify({'error': 'No se recibió archivo'}), 400


@imgs_bp.get('/gallery')
def gallery():
    img_model = ImagesModel(current_app)
    response = img_model.show_gallery()
    return response


@imgs_bp.route('/imagenes/<path:filename>')
def proxy_minio(filename):
    # Redirige al navegador hacia MinIO (puerto 9000)
    return redirect(f"http://localhost:9000/product-images/{filename}")