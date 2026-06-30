# ─── Flora backend image ─────────────────────────────────────────────────────
FROM node:24-alpine

# Prisma needs OpenSSL present even when using the JS (adapter-pg) driver.
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies first so Docker layer-caching skips re-installs when only
# source changes. `postinstall` runs `prisma generate`, so the schema is copied
# before npm install.
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev

# Copy the rest of the application source.
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "src/server.js"]
