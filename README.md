<div align="center">

```text

_________________________ ________________________ 
\_   _____/\__    ___/   |   \_   _____/\______   \
 |    __)_   |    | /    ~    \    __)_  |       _/
 |        \  |    | \    Y    /        \ |    |   \
/_______  /  |____|  \___|_  /_______  / |____|_  /
        \/                 \/        \/         \/
```

<div align="left">


Ether is a full-stack audio sharing platform built with Next.js, Prisma, and PostgreSQL, designed for independent artists to upload, manage, and share music.
It uses serverless infrastructure on Vercel, Cloudflare R2 for object storage, and Neon PostgreSQL for production data.

# Features
Core Functionality

User authentication with email + password

Artist profile pages with public URLs (/user/[artistName])

Audio track uploads with optional artwork

Public / private track visibility

User-specific dashboards to manage uploaded tracks

Server-rendered and client-rendered pages using Next.js

# Storage & Media

Audio files stored in Cloudflare R2

Artwork images stored in Cloudflare R2

Signed upload pipeline via serverless API routes

Metadata stored in PostgreSQL via Prisma ORM

# Security

JWT-based authentication

Protected upload routes (must be signed in)

User-owned track access control

Environment-based secrets management

# Testing

Jest for backend API route testing

Playwright for end-to-end frontend testing

Isolated test environment for API validation

# Tech Stack
## Frontend

Next.js (Pages Router)

Native HTML + CSS (no Tailwind)

Client-side data fetching with fetch

CSS Modules + global styles

## Backend

Next.js API Routes (serverless)

Prisma ORM

JWT authentication

Formidable for multipart file uploads

## Database

PostgreSQL

Neon (production)

Local PostgreSQL or SQLite (development)

Prisma migrations for schema changes

## Object Storage

Cloudflare R2

Audio files

Artwork images

AWS SDK (S3-compatible API)

Hosting & Infrastructure

Vercel (frontend + API routes)

Neon (managed PostgreSQL)

Cloudflare R2 (object storage)

# Architecture Overview
Client (Browser)
   |
   |  HTTPS
   v
Next.js (Vercel)
 ├─ Pages (UI)
 ├─ API Routes (Auth, Upload, Tracks)
 │    ├─ JWT Verification
 │    ├─ Prisma ORM
 │    └─ Cloudflare R2 SDK
 |
 v
PostgreSQL (Neon)

## Upload Flow

User signs in and receives a JWT

User submits track + metadata via form

API route:

Verifies JWT
