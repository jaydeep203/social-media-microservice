# Identity Service

Responsible for user registration, login, refresh tokens and logout. Uses MongoDB to store users and refresh tokens.

## Start

```powershell
cd identity-service
npm install
npm run dev   # or npm start
```

## Environment variables

Create a `.env` file with the following values:

- PORT (e.g. 3001)
- MONGODB_URL (MongoDB connection string)
- REDIS_URL (e.g. redis://redis:6379)
- RABBITMQ_URL (e.g. amqp://rabbitmq:5672)
- JWT_SECRET (secret for signing/verifying JWT access tokens)
- NODE_ENV (optional)

## API Endpoints

Base path: `/api/auth`

- POST `/register` — Register a new user
  - Body: { username, email, password }
  - Response: { success, message, accessToken, refreshToken }

- POST `/login` — Login with email and password
  - Body: { email, password }
  - Response: { accessToken, refreshToken, userId }

- POST `/refresh-token` — Exchange refresh token for a new access token
  - Body: { refreshToken }
  - Response: { accessToken, refreshToken }

- POST `/logout` — Invalidate a refresh token
  - Body: { refreshToken }
  - Response: { success, message }

## Data models

- User: username, email, password (hashed with argon2)
- RefreshToken: token, user, expiresAt (expires after 7 days)

## Notes

- Sensitive endpoints (registration) use additional rate limits backed by Redis.
- Passwords are hashed with argon2. JWTs expire in 60 minutes.
