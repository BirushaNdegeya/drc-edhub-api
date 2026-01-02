Auth & User setup

Install required packages:

```bash
npm install @nestjs/passport passport passport-google-oauth20
npm install class-validator class-transformer
npm install @nestjs/jwt passport-jwt
npm install @nestjs/swagger swagger-ui-express
```

Environment variables (example):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` for Postgres
- `GOOGLE_CLIENT_ID` - Google OAuth client id
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Callback URL (e.g. http://localhost:3000/auth/google/callback)

Notes:
- The Google auth flow is implemented via `/auth/google` (start) and `/auth/google/callback` (redirect).
- The callback currently creates/fetches a `User` by `googleId` and returns the user object. Integrate JWT/session per your needs.
- The `PATCH /users/:id` endpoint updates a user. Use JSON body matching fields in `src/users/dto/update-user.dto.ts`.

Swagger UI
- After starting the server, open `http://localhost:3000/docs` to view API documentation and example requests/responses.
- The docs show how to call `/auth/google` (start flow) and the `PATCH /users` route which requires a Bearer token. Use the `Authorize` button in the UI to set `Bearer <token>` for requests.
