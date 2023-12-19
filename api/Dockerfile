FROM node:current as builder

WORKDIR /build

# Add Files
ADD . .

# Build
RUN yarn install && yarn workspace api build

FROM node:current

WORKDIR /app

ADD yarn.lock .
ADD api/package.json .
ADD api/migrate.sh .
ADD api/migration.config.mjs .

ENV NODE_ENV production

RUN yarn install && yarn cache clean

COPY --from=builder /build/api/dist /app

CMD [ "./migrate.sh", "&&", "node", "main.js" ]