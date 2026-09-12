# From Splintered to Centered

A eight-scene woodland website for the book by Dr. Sanjiv Chopra and Dr. Loren Michaels Harris.

## Development

```sh
npm install
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000. Stop the development server before running `npm run build`; both commands use `.next/`. Run `npm run start -- --hostname 127.0.0.1` to preview the production build.

## Content and artwork

The eight scenes cover the book, its journey, dimensions, authors, Centered Voices, practical reflection, and newsletter invitation. Content lives in `components/Sections.tsx`, with dimension copy, URLs and video configuration in `data/book.ts`.

The actual cover appears once. The panoramic promotion appears once. The full event lineup has its own section after the practical reading section. The duplicate promotional image is not used.

Generated scenery is optimized into desktop and mobile WebP assets. Exact prompts and generation provenance are recorded in `ART-DIRECTION.md`.

Welcome films and transcripts are pending. Newsletter submission is a local demonstration: it sends and stores no data. Connect an email provider before opening signup. No release date, price or retailer is assumed.
