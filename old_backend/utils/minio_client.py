from minio import Minio
import os

client = Minio(
    endpoint=os.getenv("MINIO_ENDPOINT").replace("http://", ""),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=os.getenv("MINIO_SECURE", "False").lower() == "true"
)

BUCKET_NAME = os.getenv("MINIO_BUCKET", "product-images")

def upload_to_minio(file_obj, filename, content_type):
    if not client.bucket_exists(BUCKET_NAME):
        client.make_bucket(BUCKET_NAME)

    client.put_object(
        bucket_name=BUCKET_NAME,
        object_name=filename,
        data=file_obj,
        length=-1, #no sabemos el tamaño del archivo
        part_size=10*1024*1024, #tamaño de las partes 10MB
        content_type=content_type
    )

    return f"{os.getenv('MINIO_ENDPOINT')}/{BUCKET_NAME}/{filename}"
    #esta url funciona solo cuando minio esta en modo publico (solo desarrollo)
    