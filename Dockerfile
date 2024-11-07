# Usa la imagen oficial de Node.js versión 18.17.1-alpine
FROM node:18.17.1-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código del proyecto al contenedor
COPY . .

# Expone el puerto 3000
EXPOSE 3500

# Comando para ejecutar la aplicación
CMD ["npm", "run","dev"]