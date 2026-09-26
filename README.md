# ShelfTrack

ShelfTrack is a responsive field operations app for collecting supermarket shelf photos with location, date, and collector attribution. It is built as a Next.js web app and installable mobile PWA backed by Neon Auth.

## Roles

- `user`: submits their own shelf visits
- `data_entry`: can submit visits on behalf of another collector
- `admin`: can submit on behalf of others and create users

Neon Auth retains its built-in `user` and `admin` security roles. The `data_entry` permission is stored as application metadata so data-entry users do not receive Auth administration access.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide:

- `NEON_AUTH_BASE_URL`: the production branch Auth URL
- `NEON_AUTH_COOKIE_SECRET`: a secret generated with `openssl rand -base64 32`

## Vercel deployment

1. Import this GitHub repository into Vercel as a Next.js project.
2. Add `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` in Vercel project settings.
3. Deploy the project.
4. Add the resulting `https://<project>.vercel.app` domain to the Neon Auth trusted domains list.

No `vercel.json` is required; Vercel detects the Next.js application automatically.

## Current scope

The authentication and user administration flows are connected to Neon Auth. Shelf records and photo uploads currently demonstrate the complete interface flow with sample data; database persistence and private Object Storage uploads are the next backend phase.
