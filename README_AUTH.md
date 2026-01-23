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
- `ROLE_SECRET` - Secret token used to authorize exceptional role changes via `/auth/change-role`

For local development, you can export them in your shell:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASS=
export DB_NAME=drc_db

export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

export ROLE_SECRET=your-very-secure-role-secret
```

To use the `change-role.sh` helper script and the corresponding API route, make sure you set `ROLE_SECRET` **in both the Nest server environment and the shell where you run the script**, with the same value:

```bash
# Terminal 1: start Nest API
export ROLE_SECRET=your-very-secure-role-secret
npm run dev

# Terminal 2: change a user role
cd /home/birusha/Documents/work/ed/drc-edhub-api
export ROLE_SECRET=your-very-secure-role-secret
./change-role.sh user@example.com admin
```

Notes:
- The Google auth flow is implemented via `/auth/google` (start) and `/auth/google/callback` (redirect).
- The callback currently creates/fetches a `User` by `googleId` and returns the user object. Integrate JWT/session per your needs.
- The `PATCH /users/:id` endpoint updates a user. Use JSON body matching fields in `src/users/dto/update-user.dto.ts`.

Swagger UI
- After starting the server, open `http://localhost:3000/docs` to view API documentation and example requests/responses.
- The docs show how to call `/auth/google` (start flow) and the `PATCH /users` route which requires a Bearer token. Use the `Authorize` button in the UI to set `Bearer <token>` for requests.
