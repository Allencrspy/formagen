# Formagen

A server-driven form builder: build a form, publish a version, share a public link, and see every response.

**Live (dev stage):** https://d2hktiu7yyvw8w.cloudfront.net

Built with Next.js 16, TypeScript, Zod, Drizzle + Postgres (Neon), Auth.js, and deployed to AWS (Lambda + CloudFront + S3) with SST.
Full write-up coming at v1. Design: [`docs/specs`](docs/specs), plan: [`docs/plans`](docs/plans).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:migrate
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm test`.

## Deploy (AWS via SST)

Infrastructure is in [`sst.config.ts`](sst.config.ts). Region `ap-southeast-2`.

```bash
npx sst secret set DatabaseUrl  "<neon pooled url>" --stage dev
npx sst secret set AuthSecret   "<random 32+ bytes>" --stage dev
npx sst secret set GithubId     "<oauth app client id>" --stage dev
npx sst secret set GithubSecret "<oauth app client secret>" --stage dev
npx sst deploy --stage dev
```

Each stage needs its own GitHub OAuth app whose callback is `<stage url>/api/auth/callback/github`.
The deployed app uses Neon's **pooled** URL (Lambda scales out); migrations use the direct URL.
