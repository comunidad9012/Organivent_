# Usa una imagen base de Python
FROM python

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto de los archivos del backend
COPY . .

# Expone el puerto en el que corre Flask
EXPOSE 5000

# Comando para ejecutar la app
ENTRYPOINT ["python3", "main.py"]