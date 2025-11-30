FROM node:24-alpine AS deps
WORKDIR /app
COPY sooindustry-react/package.json sooindustry-react/package-lock.json ./
RUN npm ci --legacy-peer-deps=false

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY sooindustry-react ./
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=14825
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --legacy-peer-deps=false

EXPOSE 14825

CMD ["npm", "run", "start"]
