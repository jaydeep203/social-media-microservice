# API Gateway

The API Gateway proxies requests from clients to the backend services. It provides global middleware such as rate limiting, logging, security headers and token validation.

## Start

Install dependencies and run:

```powershell
cd api-gateway
npm install
npm run dev   # or npm start
```

## Environment variables

Create a `.env` file in `api-gateway/` with at least:

- PORT (defaults to 3000)
- IDENTITY_SERVICE_URL (e.g. http://identity-service:3001)
- POST_SERVICE_URL (e.g. http://post-service:3002)
- MEDIA_SERVICE_URL (e.g. http://media-service:3003)
- SEARCH_SERVICE_URL (e.g. http://search-service:3004)
- REDIS_URL (e.g. redis://redis:6379)
- RABBITMQ_URL (e.g. amqp://rabbitmq:5672)
- JWT_SECRET (shared secret used to verify access tokens)

## Routes (proxied)

- `/v1/auth/*` -> proxied to Identity Service (`/api/auth/*`)
- `/v1/posts/*` -> proxied to Post Service (`/api/posts/*`) — requires valid JWT
- `/v1/media/*` -> proxied to Media Service (`/api/media/*`) — requires valid JWT
- `/v1/search/*` -> proxied to Search Service (`/api/search/*`) — requires valid JWT

## Notes

- The gateway validates JWTs and injects `x-user-id` header when proxying to downstream services.
- Rate limiting is enabled using Redis as a store.
