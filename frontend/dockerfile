# Usar una imagen base de Node.js
FROM node

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias saltandose las advertencia.
RUN npm install --legacy-peer-deps 

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que Vite usa por defecto
EXPOSE 5173

# Correr el servidor de desarrollo de Vite
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]
