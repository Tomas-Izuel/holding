# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Instalar solo las dependencias de producción
RUN npm install --production

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"] 