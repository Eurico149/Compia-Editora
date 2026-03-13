FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM alpine:3.20

WORKDIR /web_files

COPY --from=builder /app/dist .