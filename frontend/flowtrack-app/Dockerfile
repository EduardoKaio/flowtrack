# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Aceitar argumento de build para NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copiar arquivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar dependencias
RUN npm ci || npm install

# Copiar codigo fonte
COPY . .

# Build da aplicacao Next.js
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Criar usuario nao-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessarios do builder
# Se usar standalone output (recomendado)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Alternativa se standalone nao funcionar - descomente estas linhas e comente as acima
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Se usar standalone
CMD ["node", "server.js"]

# Alternativa se nao usar standalone - descomente esta linha e comente a acima
# CMD ["npm", "start"]
