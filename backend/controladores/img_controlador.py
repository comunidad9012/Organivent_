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
    if 'file' not in request.files:
        return jsonify({'error': 'No se recibió archivo'}), 400

    files = request.files.getlist('file')
    imagenes_urls = []

    img_model = ImagesModel(current_app)

    for file in files:
        if file.filename == '':
            continue

        filename = secure_filename(file.filename)
        file_stream = BytesIO(file.read())

        try:
            upload_to_minio(file_stream, filename, file.mimetype)
            file_url = f"http://localhost:5000/imgs/imagenes/{filename}"

            # Guardar en MongoDB y obtener el id insertado
            inserted_id = img_model.save_image_db(filename, file_url)

            imagenes_urls.append({
                "_id": inserted_id,
                "filename": filename,
                "url": file_url
            })

        except Exception as e:
            current_app.logger.exception(f"Error al subir {filename}: {e}")
            return jsonify({'error': f'Falló la subida de {filename}'}), 500

    return jsonify({'locations': imagenes_urls}), 200

@imgs_bp.get('/gallery')
def gallery():
    img_model = ImagesModel(current_app)
    response = img_model.show_gallery()
    return response


@imgs_bp.route('/imagenes/<path:filename>')
def proxy_minio(filename):
    # Redirige al navegador hacia MinIO (puerto 9000)
    return redirect(f"http://localhost:9000/product-images/{filename}")