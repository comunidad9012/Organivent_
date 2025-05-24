#!/bin/sh

echo "Verificando conexión con MinIO..."

# espera a que el servicio esté activo
# configura alias minio con las credenciales
until mc alias set minio http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"; do
  echo "⏳ Esperando que MinIO esté disponible..."
  sleep 3
done

echo "✔ Creando bucket ${MINIO_BUCKET}..."
mc mb minio/${MINIO_BUCKET} || echo "Bucket ya existe."
# mb crea el bucket, si existe muestra el mensaje

echo "✔ Haciendo público el bucket..."
mc anonymous set public minio/${MINIO_BUCKET}|| echo "⚠️  No se pudo hacer público el bucket. Verifica si existe."
# para ver una imagen directamente sin una url para produccion

echo "✔✔ Configuración completada! Bucket ${MINIO_BUCKET} listo"
#confirma tooodo el proceso de configuración

# Listar buckets para ver que existe
echo "Buckets actuales:"
mc ls minio

# Archivo de prueba
echo "Archivo de prueba :)" > prueba.txt #crea el archivo con su contenido
mc cp prueba.txt minio/${MINIO_BUCKET}/ #sube al bucket
rm prueba.txt #borra el archivo local con rm