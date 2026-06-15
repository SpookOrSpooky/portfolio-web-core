# Daniel Campbell Portfolio Webapp

Hostable React/Vite portfolio site for Daniel Campbell, styled as an interactive browser/desktop workbench inspired by PostHog's playful product UI language while using original assets and content.

## What is included

- Responsive single-page portfolio webapp with browser chrome, project files, active tabs, a dock, and switchable workspace windows.
- Project showcase for GraphRAG, recommender systems, agentic RAG, MLOps, legal retrieval, voice conversion, secure GeoSat AIOps, and RL web parsing work.
- Expanded experience, technical stack, credentials, policy, and public leadership sections.
- Blog area with manual post cards and an optional Substack embed slot.
- Generated project hero asset stored at `src/assets/ai-workbench-hero.png`.
- Open Graph image at `public/og-image.png`, RSS placeholder at `public/rss.xml`, and PWA manifest at `public/manifest.webmanifest`.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Build and preview

```bash
npm run build
npm run preview
```

The production files are emitted to `dist/`.

## Configure the Substack embed

Set `VITE_SUBSTACK_URL` to your Substack embed URL before running or deploying:

```bash
VITE_SUBSTACK_URL=https://your-publication.substack.com/embed npm run dev
```

For hosted deployments, add `VITE_SUBSTACK_URL` as an environment variable in the hosting provider dashboard. If it is not set, the site shows a ready-state panel and the manual post cards remain visible.

Manual posts are edited in `src/App.tsx` in the `blogPosts` array.

## RSS and metadata

The app ships with static RSS discovery at `public/rss.xml`. Replace the `https://example.com/` links with your production domain before launch.

The Open Graph image is `public/og-image.png`. Replace it if you want a custom social preview.

## Deployment

### Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new Vercel project and import the repository.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_SUBSTACK_URL` only if you want the embedded Substack panel.
7. Deploy.

### Netlify

1. Push this repository to a Git provider.
2. Create a new Netlify site from the repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add `VITE_SUBSTACK_URL` under Site configuration > Environment variables if needed.
6. Deploy.

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Add `VITE_SUBSTACK_URL` if needed.
6. Deploy.

### Static hosting or S3

```bash
npm install
npm run build
```

Upload the contents of `dist/` to any static web host. For AWS S3 + CloudFront, enable static website hosting or serve through CloudFront with `index.html` as the default root object.

## Editing content

Most portfolio content lives in arrays near the top of `src/App.tsx`:

- `projects`
- `experience`
- `stackGroups`
- `blogPosts`
- `signalStats`
- `contact`

After editing, run:

```bash
npm run build
```
