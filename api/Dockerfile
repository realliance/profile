FROM node:current as builder

WORKDIR /build

# Add Web Files
ADD . .
ADD package.json .
ADD yarn.lock .

# Build
RUN yarn install && yarn build

FROM node:current

WORKDIR /app

COPY --from=builder /build/dist /app

CMD [ "node", "main.js" ]