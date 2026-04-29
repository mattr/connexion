# syntax=docker/dockerfile:1

FROM node:24-alpine AS client-build

WORKDIR /workspace
COPY client/package*.json ./client/

WORKDIR /workspace/client
RUN npm ci

WORKDIR /workspace
COPY client ./client

ARG PUBLIC_POCKETBASE_URL
ENV PUBLIC_POCKETBASE_URL=${PUBLIC_POCKETBASE_URL}
RUN test -n "$PUBLIC_POCKETBASE_URL" && cd client && npm run build

FROM golang:1.26-alpine AS server-build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=client-build /workspace/pb_public ./pb_public

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/connexion .

FROM alpine:3.22

RUN addgroup -S connexion && adduser -S -G connexion connexion

WORKDIR /app

COPY --from=server-build /out/connexion ./connexion
COPY --from=client-build /workspace/pb_public ./pb_public

RUN mkdir -p /data && chown -R connexion:connexion /app /data

USER connexion

EXPOSE 8080

ENTRYPOINT ["./connexion"]
CMD ["serve", "--http=0.0.0.0:8080", "--dir=/data"]
