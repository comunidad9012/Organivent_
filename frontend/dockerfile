# Usar una imagen base de Node.js
FROM node

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --legacy-peer-deps 

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que el servidor web utilizará
EXPOSE 5173

ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]