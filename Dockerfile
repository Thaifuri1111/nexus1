FROM node:20-alpine AS builder

WORKDIR /app

# ─── COPY PACKAGE ───
COPY package*.json ./
COPY prisma ./prisma/

# ─── INSTALL ───
RUN npm install

# ─── GENERATE PRISMA ───
RUN npx prisma generate

# ─── BUILD ───
COPY . .
RUN npm run build

# ─── PRODUCTION ───
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
