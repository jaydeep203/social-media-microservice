# Search Service

Indexes posts for full-text search and provides an endpoint to search posts. Consumes post.created and post.deleted events to keep its index updated.

## Start

```powershell
cd search-service
npm install
npm run dev   # or npm start
```

## Environment variables

- PORT (e.g. 3004)
- MONGODB_URL
- REDIS_URL (e.g. redis://redis:6379)
- RABBITMQ_URL (e.g. amqp://rabbitmq:5672)
- NODE_ENV (optional)

## API Endpoints

Base path: `/api/search`

- GET `/posts?query=...` — Search posts (protected)
  - Query param: `query`
  - Response: array of matched posts (top 10)

## Events

- Subscribes to RabbitMQ:
  - `post.created` — adds post to search index and invalidates search cache
  - `post.deleted` — removes post from index and invalidates search cache

## Notes

- Uses Redis to cache search results under keys `searches:<query>`.
- The search model has a text index on the `content` field for fast text search.
