# Build stage
FROM node:24-alpine AS builder

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /src

RUN npm install -g serve@latest

COPY --from=builder /src ./src

EXPOSE 4200

CMD [ "serve", "-s", "src" ]
