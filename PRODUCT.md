# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (Pages Router) with React, Prisma ORM, PostgreSQL, Cloudflare R2 object storage, and Vercel hosting. Server-side API routes handle auth, uploads, and track management.

## Users

Primary users are independent artists and creators who need a simple way to upload music, manage public or private releases, and share a profile with listeners. Secondary users include listeners who discover and access artist pages and audio tracks.

## Product Purpose

Ether is a full-stack audio sharing platform that lets artists upload, organize, and distribute music while preserving ownership and control over their uploads. Success means artists can publish tracks, present a polished profile, and manage audio assets without custom infrastructure.

## Positioning

Ether differentiates itself by combining artist-owned profile pages, direct audio upload workflows, and platform-managed media storage in a streamlined Next.js app built for independent creators rather than large-label distribution.

## Operating Context

Artists use Ether to manage their uploaded tracks, optional cover art, and public/private visibility settings from a dashboard. The product operates in a web environment with serverless API routes, database-backed metadata, and Cloudflare R2-backed media storage. The workflow includes authentication, upload, metadata management, and public sharing through artist profile URLs.

## Capabilities and Constraints

Confirmed capabilities:
- Email + password authentication with JWT-based session handling
- Artist profile pages at /user/[artistName]
- Track upload with optional artwork and metadata
- Public and private track visibility controls
- User-specific dashboard for managing uploaded tracks
- Next.js server-rendered and client-rendered pages
- Object storage via Cloudflare R2 for audio and artwork
- Signed upload pipeline via serverless API routes

Confirmed constraints:
- Product is web-first and built with Next.js Pages Router
- Media files are stored in Cloudflare R2, not embedded in the database
- Metadata is stored in PostgreSQL via Prisma
- Protected upload and access flows require authenticated users and ownership checks
- Project uses environment-based secrets and deployment targets aligned with Vercel + Neon + Cloudflare R2

## Brand Commitments

The product name is Ether. The visual identity should be distinctive, independent-music oriented, and artwork-led: mostly black and white with one restrained signal accent, boxy old-web-inspired controls, strong typography and hierarchy, and a cohesive experience across artist profiles, track cards, and the dashboard. Avoid generic SaaS styling, purple-gradient AI aesthetics, excessive rounded cards, unnecessary animation, glossy gradient sidebar buttons, and fake-looking playback controls.

## Evidence on Hand

- README.md: product overview, feature list, architecture, storage, security, and workflow notes
- package.json: Next.js, Prisma, PostgreSQL, AWS SDK, and testing stack
- project structure includes pages, components, lib, prisma, scripts, and public assets
- The app is described as running on Vercel with Cloudflare R2 and Neon PostgreSQL in production

## Product Principles

1. Creator ownership and control: artists maintain their content, profile identity, and visibility settings.
2. Operational simplicity: upload and manage music through a clear web workflow without custom deployment work.
3. Trust and access control: authenticated and user-owned data access is enforced across uploads and track management.
4. Platform reliability: the app separates media storage from database metadata while keeping the user experience simple.
5. Product utility over spectacle: the product exists to support independent music publishing and discovery.

## Accessibility & Inclusion

The product is expected to meet standard web accessibility expectations for forms, navigation, and media controls, but no product-specific accessibility requirement beyond general inclusive web delivery was explicitly documented.
