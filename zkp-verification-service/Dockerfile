FROM node:20-alpine AS base
WORKDIR /app


RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM deps AS build
COPY . ./
RUN pnpm run build


FROM node:20-alpine AS runtime
WORKDIR /app


RUN corepack enable


COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/proto ./proto
COPY package.json ./


EXPOSE 50051

CMD ["node", "dist/server.js"]
