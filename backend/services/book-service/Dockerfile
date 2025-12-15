FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
COPY ../../config ./config
COPY ../../routes ./routes
COPY ../../middleware ./middleware
COPY ../../models ./models

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 5103

CMD ["node", "server.js"]


