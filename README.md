# Editorial book experience

This is the second design on `codex/editorial-book-experience`. The woodland design is preserved on GitHub `main` and in the neighboring `book` folder.

## Preview

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Stop the development server before `npm run build`. Use `npm run start -- --hostname 127.0.0.1 --port 3001` for the production preview.

## Content and services

- `data/editorial.ts`: copy, authors, video URLs, transcripts, primary CTA, newsletter endpoint, optional purchase/media/social links, library/events toggles, and private verification metadata.
- `data/experience.ts`: client-safe CTA and newsletter endpoint settings.
- `data/book.ts`: seven dimensions and canonical URL.
- `components/EditorialPage.tsx`: complete ordered editorial page.
- `components/EditorialClient.tsx`: navigation, video dialog, analytics hooks, cover fallback, and form behavior.

Set author video URLs to an embeddable provider URL or an MP4/WebM URL. Players load on interaction, with no autoplay. Add transcripts when the videos are ready. Do not present uncaptioned videos as accessible: provide captions through the configured player before publishing.

Newsletter integration TODO: set `newsletterEndpoint` in `data/experience.ts` to an API that accepts JSON `{ firstName, email, consent: true }`. The server must validate fields, enforce consent, rate-limit requests and subscribe through the selected email provider. Return 2xx only after accepting signup. No endpoint ships in this prototype; blank configuration sends/stores no data and never claims a subscription succeeded. Update privacy copy before enabling the service.

Analytics are local `book:analytics` CustomEvents with `{event}` details. No tracking provider is installed. Submission success events fire only after an actual successful response. Purchase/media/social links remain hidden while unset. Verification flags stay internal.

## Validation

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Images have explicit dimensions and secondary images load lazily. Native images are intentional; the Next image-element lint recommendation is disabled.

Retained supplied artwork: cover once; each portrait once in welcome cards; panoramic campaign and full event banner in separate sections. Woodland imagery appears in the two contemplative breaks.

The existing Next.js 14.2.30 dependency reports a security advisory and should be upgraded before public deployment.
