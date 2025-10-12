# Post Service

Manages posts and publishes events to RabbitMQ when posts are created or deleted. Uses MongoDB for persistence and Redis for caching.

## Start

```powershell
cd post-service
npm install
npm run dev   # or npm start
```

## Environment variables

- PORT (e.g. 3002)
- MONGODB_URL
- REDIS_URL (e.g. redis://redis:6379)
- RABBITMQ_URL (e.g. amqp://rabbitmq:5672)
- NODE_ENV (optional)

## API Endpoints

Base path: `/api/posts`

- POST `/create-post` — Create a new post (protected)
  - Body: { content, mediaIds? }

- GET `/all-posts` — Paginated list (protected)
  - Query: page, limit

- GET `/:id` — Get a single post by id (protected)

- DELETE `/:id` — Delete a post (protected, only owner)

## Events

- Publishes to RabbitMQ exchange `facebook_events` using topic routing:
  - `post.created` — payload includes postId, userId, content, createdAt
  - `post.deleted` — payload includes postId, userId, mediaIds

## Notes

- The service expects `x-user-id` header injected by the API Gateway (or a calling client during local dev) to identify the authenticated user.
- Post lists are cached in Redis. The cache keys are `posts:<page>:<limit>` and individual posts use `post:<id>`.
