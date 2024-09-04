# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias con la opción --legacy-peer-deps
RUN npm ci --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]