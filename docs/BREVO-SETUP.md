# Brevo setup for book preorder requests

The site keeps two lists separate:

- **Book preorder requests** receives every submitted request. Do not use this list for marketing campaigns; it also includes people who only agreed to receive a response about their request.
- **Dr. Loren updates** receives contacts through Brevo's double opt-in flow. This is the general list for people who explicitly request occasional updates from Dr. Loren about his work, reflections, conversations, and book news.

## Required Brevo configuration

1. Keep **Book preorder requests** as list #3 and **Dr. Loren General Updates** as list #2 in the connected Brevo account. The app uses list #2 by default. Set `BREVO_LOREN_UPDATES_LIST_ID` when deploying to another Brevo account or environment.
2. Create a double opt-in email template suitable for the Brevo `POST /v3/contacts/doubleOptinConfirmation` API. Make clear that signing up means occasional updates from Dr. Loren (not just book updates), record its template ID, and include the confirmation link in the message.
3. Create a Brevo API key with contact write access.
4. Add these environment variables to the Next.js runtime. Do not add secrets to Git or expose them to client-side code.

```text
BREVO_API_KEY=...
BREVO_PREORDER_LIST_ID=...
BREVO_LOREN_UPDATES_LIST_ID=2
BREVO_DOI_TEMPLATE_ID=...
BREVO_QUANTITY_ATTRIBUTE=PREORDER_QUANTITY
BREVO_SOURCE_ATTRIBUTE=PREORDER_SOURCE
```

`BREVO_QUANTITY_ATTRIBUTE` and `BREVO_SOURCE_ATTRIBUTE` are optional. If configured, create matching Brevo contact attributes first (Number for quantity, Text for source). The site uses these attributes to retain request quantity and whether the visitor arrived from the main site, Dr. Loren's site, or Dr. Sanjiv's site.

The form stores all requests in the preorder list. Its separate, optional checkbox asks whether the visitor wants occasional email updates from Dr. Loren. If checked, it triggers a double opt-in to the Dr. Loren General Updates list (#2); the contact is not eligible for that list's campaigns until they confirm. The confirmation link returns to `/preorder/confirmed`.

If Brevo is unavailable, the existing email request flow still receives the preorder request. The visitor sees a notice when list sync or the updates confirmation could not be completed, and the notification email tells the preorder team to review Brevo.

## Website links for source attribution

- Main website: `https://fromsplinteredtocentered.com/preorder?utm_source=main-site`
- Dr. Loren's website: `https://fromsplinteredtocentered.com/preorder?utm_source=dr-loren-website`
- Dr. Sanjiv's website: `https://fromsplinteredtocentered.com/preorder?utm_source=dr-sanjiv-website`
