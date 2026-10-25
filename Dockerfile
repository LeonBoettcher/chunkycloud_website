FROM node:24-slim AS base
WORKDIR /usr/src/app
RUN npm install --global pnpm@11.6.0

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./

ARG NEXT_PUBLIC_BACKEND_URL=https://api.chunkycloud.net
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production

COPY --from=build /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

COPY --from=build --chown=node:node /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

USER node
EXPOSE 3000
CMD ["pnpm", "start"]
