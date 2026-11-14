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

The form stores all requests in the preorder list and emails the book team. Each valid submission also results in one requester email, regardless of the number of copies:

- If the visitor leaves the optional updates checkbox unchecked, the site sends a receipt through SMTP. It includes the requested quantity, says no payment was collected, and explains that the team will follow up with pricing and availability.
- If the visitor checks the box, Brevo sends the DOI template as the receipt. It includes the same request details plus a separate button to confirm occasional updates from Dr. Loren. The contact is not eligible for that list's campaigns until they click the button. The confirmation link returns to `/preorder/confirmed`.
- If Brevo definitively rejects the DOI request, the site sends a receipt-only SMTP fallback and reports that updates were not confirmed. If the DOI request times out with an unknown outcome, it does not send a second email that could duplicate one Brevo accepted; the page asks the requester to check their inbox and spam folder.

The DOI template uses the `PREORDER_QUANTITY` contact attribute when configured. `BREVO_QUANTITY_ATTRIBUTE` must match that attribute name for quantity to appear in the combined email.

If Brevo is unavailable before sending the DOI email, the receipt-only SMTP flow still runs and the notification email tells the preorder team to review Brevo. If requester email or team notification fails, the site reports the known delivery/recording status instead of claiming success.

## Website links for source attribution

- Main website: `https://fromsplinteredtocentered.com/preorder?utm_source=main-site`
- Dr. Loren's website: `https://fromsplinteredtocentered.com/preorder?utm_source=dr-loren-website`
- Dr. Sanjiv's website: `https://fromsplinteredtocentered.com/preorder?utm_source=dr-sanjiv-website`
