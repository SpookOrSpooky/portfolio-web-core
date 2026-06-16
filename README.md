# Daniel Campbell Portfolio Webapp

Hostable React/Vite portfolio site for Daniel Campbell, styled as an interactive browser/desktop workbench inspired by PostHog's playful product UI language while using original assets and content.

## What is included

- Responsive single-page portfolio webapp with browser chrome, project files, active tabs, a dock, and switchable workspace windows.
- Project showcase for application engineering, cloud engineering, GraphRAG, recommender systems, agentic RAG, MLOps, legal retrieval, voice conversion, secure GeoSat AIOps, and RL web parsing work.
- Expanded experience, technical stack, cloud engineering, credentials, policy, and public leadership sections.
- Generated project hero asset stored at `src/assets/ai-workbench-hero.png`.
- Open Graph image at `public/og-image.png`, favicon at `public/favicon.svg`, and PWA manifest at `public/manifest.webmanifest`.

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

## Metadata

The Open Graph image is `public/og-image.png`. Replace it if you want a custom social preview. The browser favicon is `public/favicon.svg` and works on Cloudflare Pages as a normal static asset.

## Deployment

### Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new Vercel project and import the repository.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

### Netlify

1. Push this repository to a Git provider.
2. Create a new Netlify site from the repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Deploy.

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Deploy.

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
- `cloudCapabilities`
- `signalStats`
- `contact`

After editing, run:

```bash
npm run build
```
