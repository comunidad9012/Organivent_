import os
from flask import Blueprint, request, current_app, jsonify
from werkzeug.utils import secure_filename
from minio import Minio
from minio.error import S3Error
from models.modelImgs import ImagesModel

#config de minio
minio_client = Minio(
    "minio:9000",
    access_key=os.getenv("MINIO_ROOT_USER"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD"),
    secure=False
)
BUCKET_NAME = os.getenv("MINIO_BUCKET", "product-images")

imgs_bp = Blueprint('imgs', __name__, url_prefix='/imgs')

ALLOWED_EXTENSIONS={'png', 'jpeg', 'jpg', 'webp'}#filtro

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@imgs_bp.post('/upload')
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            try:
                #acá subimos al minio
                minio_client.put_object(
                    BUCKET_NAME,
                    filename,
                    file,
                    length=file.content_length,
                    content_type=file.content_type
                )
                #podemos usar localhost temporalmente
                file_url = f"http://localhost:9000/{BUCKET_NAME}/{filename}"
                #guardamos en la base de datos mongo
                img_model = ImagesModel(current_app)
                img_model.save_image_db(filename, file_url)
                return jsonify({'location': file_url})

            except S3Error as e:
                return jsonify({'error': f"Error al subir a MinIO: {str(e)}"}), 500

@imgs_bp.get('/gallery')
def gallery():
    img_model = ImagesModel(current_app)
    response = img_model.show_gallery()
    return response


"""
Configuración:
- Cliente MinIO conectado al servicio en Docker (9000)
- Bucket por defecto: 'product-images' (configurable via ENV)
- Extensiones permitidas: png, jpeg, jpg, webp

Funcionalidades:
1. upload_file():
   - Valida y sube archivos al MinIO
   - Sanitiza nombres con secure_filename
   - Guarda metadatos (nombre + URL) en MongoDB
   - Devuelve URL pública temporal (localhost en desarrollo)
2. gallery():
   - Recupera lista de imágenes desde MongoDB

Notas:
- Para producción: 
  * Reemplazar 'localhost' por dominio real
  * Implementar borrado al eliminar productos

"""