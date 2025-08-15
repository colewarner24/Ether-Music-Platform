# next-music-local

Minimal Next.js app for uploading audio locally. Uses Prisma + SQLite for metadata and saves audio files to `public/uploads` so they are playable at `/uploads/<filename>`.

## Setup

1. install deps

```bash
npm install
```

2. generate prisma client + run migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. run dev server

```bash
npm run dev
```

4. open http://localhost:3000 and upload audio

## Next steps

- swap disk storage for Cloudflare R2 (presigned uploads)
- swap SQLite for Neon (set `DATABASE_URL` and run migrations)
- add authentication (NextAuth)
