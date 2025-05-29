# Etapa de construcción de Prisma
FROM node:20-alpine AS prisma-builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Etapa de construcción de Next.js
FROM node:20-alpine AS next-builder
WORKDIR /app
COPY --from=prisma-builder /app/node_modules ./node_modules
COPY --from=prisma-builder /app/prisma ./prisma
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copiar archivos necesarios
COPY --from=next-builder /app/public ./public
COPY --from=next-builder /app/.next/standalone ./
COPY --from=next-builder /app/.next/static ./.next/static
COPY --from=next-builder /app/prisma ./prisma
COPY --from=prisma-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma-builder /app/node_modules/@prisma ./node_modules/@prisma

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"] 