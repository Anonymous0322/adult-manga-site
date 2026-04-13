# Manga Backend API

Production-ready backend for manga/manhwa reading platform.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (chapter image storage)
- JWT auth (admin role)
- Rate limiting
- Optional Redis caching

## Run
1. Copy `.env.example` to `.env` and fill values.
2. Install deps:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## API
- `GET /api/manga?page=1&limit=12&search=naruto`
- `POST /api/manga` (admin, multipart with `coverImage`)
- `GET /api/manga/:id`
- `PUT /api/manga/:id` (admin)
- `DELETE /api/manga/:id` (admin, also deletes chapters)

- `POST /api/chapter` (admin, multipart `images[]`)
- `GET /api/chapter/:id?imagePage=1&imageLimit=20`
- `DELETE /api/chapter/:id` (admin)

- `POST /api/upload` (admin, multipart `images[]`)

- `POST /api/auth/login`
- `POST /api/auth/register-admin`

## Notes
- `GET /api/chapter/:id` supports image pagination for lazy loading / large chapter sets.
- Caching works with Redis if `REDIS_URL` is set; otherwise falls back to in-memory cache.
