# Dennis Berger — Portfolio

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm install
npm run build
```

Output goes to `dist/`. Upload that folder to any static host.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. In Cloudflare Pages → Create a project → Connect the repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18+ (set `NODE_VERSION=18` in environment variables if needed)

## Deploy to Shared Hosting

Run `npm run build`, then upload the contents of `dist/` to your web root via FTP/SFTP.
