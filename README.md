# From Splintered to Centered

The official landing-page project for **From Splintered to Centered: 7 Dimensions for Navigating Your Soul** by Dr. Sanjiv Chopra and Dr. Loren Michaels Harris.

## Local preview

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the development server starts.

## Production check

```bash
npm run build
npm run start
```

## Content and media

- Update calls to action, author videos, feature flags, and media paths in `data/book.ts`.
- Add the approved book cover and author photography under `public/images/` using the filenames documented in `public/images/README.md`.
- The two welcome-film positions are already reserved in the second section. Add each provider URL to the matching `videoUrl` field in `data/book.ts`.
- Replace the newsletter placeholder in `components/ClientBits.tsx` when an email provider is selected.

No publication date, ISBN, publisher, pricing, retailer, or preorder details are assumed by the current implementation.
