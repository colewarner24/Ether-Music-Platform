## Testing

### Frontend

End-to-end tests are written with [Playwright](https://playwright.dev) and cover:
- User authentication (login/logout)
- Profile page visibility
- Audio file uploads to Cloudflare R2

Tests run against a local build of the app connected to the Neon PostgreSQL database.

### Structure

Playwright tests are organized using the **Page Object Model (POM)** pattern, which separates 
test logic from page interaction logic. This keeps tests clean, readable, and easy to maintain.


### Authentication

`auth.setup.js` runs before the test suite and handles logging in once, saving the 
session state to `.auth/user.json`. All subsequent tests reuse this saved state, 
avoiding repeated logins and speeding up the test suite. If the saved auth state is 
still valid, the login is skipped entirely.


### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Pipeline Overview

On every push to `main`, and on pull requests to `main`, the pipeline:

1. Installs dependencies and generates the Prisma client
2. Builds the Next.js application
3. Runs Playwright end-to-end tests against a local server
4. Deploys to Vercel (only on successful pushes to `main`)
