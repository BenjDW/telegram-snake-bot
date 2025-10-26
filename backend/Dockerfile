FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
# --install only prod deps

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build
# --build total, prod compile

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
EXPOSE 3000
CMD ["node", "dist/index.js"]
# --in prod mode, only copy and work