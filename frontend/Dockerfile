FROM node:current as web_builder

WORKDIR /build

# Add Web Files
ADD . .
ADD package.json .
ADD yarn.lock .

# Build
RUN yarn install && yarn build

FROM docker.io/nginx:1-alpine

COPY --from=web_builder /build/dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf