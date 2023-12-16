FROM node:current as builder

WORKDIR /build

# Add Files
ADD . .

# Build
RUN yarn install && yarn workspace api build

FROM node:current

WORKDIR /app

COPY --from=builder /build/api/dist /app

CMD [ "node", "main.js" ]