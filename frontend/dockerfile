#TENGO QUE REVISAR PORQUE ESTO ERA CON EL OTRO PROYECTO

# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app 
    #permitime dudar 

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación para desarrollo
CMD ["npm", "start"]
    # aca debe ser npm rub dev
    
# Exponer el puerto que el servidor web utilizará
EXPOSE 3000
