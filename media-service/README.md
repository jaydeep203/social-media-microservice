# Media Service

Handles file uploads to Cloudinary and removes media when posts are deleted. Consumes `post.deleted` events from RabbitMQ.

## Start

```powershell
cd media-service
npm install
npm run dev   # or npm start
```

## Environment variables

- PORT (e.g. 3003)
- MONGODB_URL
- REDIS_URL (e.g. redis://redis:6379)
- RABBITMQ_URL (e.g. amqp://rabbitmq:5672)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NODE_ENV (optional)

## API Endpoints

Base path: `/api/media`

- POST `/upload` — Upload a media file (protected)
  - Form field: `file` (multipart/form-data)
  - Response: { success, mediaId, url, message }

- GET `/get` — List all uploaded media (protected)

## Events

- Subscribes to RabbitMQ topic `post.deleted` to remove media documents and their files from Cloudinary when posts are deleted.

## Notes

- The service expects `x-user-id` header injected by the API Gateway for authentication when proxied.
- File uploads are streamed to Cloudinary using `cloudinary.uploader.upload_stream`.
- Max file size configured in multer: 5 MB.
