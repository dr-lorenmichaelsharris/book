import nodemailer from "nodemailer";
import { siteConfig } from "@/data/book";
import { BrevoSyncError, syncPreorderToBrevo } from "@/lib/brevo";

export const runtime = "nodejs";
const attempts = new Map<string, number>();
const mailbox = "hello@fromsplinteredtocentered.com";

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, character => entities[character]);
}

function requestReceipt(name: string, email: string, quantity: number, updatesConsent: boolean) {
  const copies = `${quantity} ${quantity === 1 ? "copy" : "copies"}`;
  const safeName = escapeHtml(name);
  const coverUrl = new URL(siteConfig.images.cover, siteConfig.canonicalUrl).href;
  const siteUrl = siteConfig.canonicalUrl;
  const updatesNote = updatesConsent
    ? "\n\nYou also asked for occasional email updates from Dr. Loren, but we couldn't send the confirmation link. You are not subscribed yet. Please contact us if you still want to join his list."
    : "";
  const updatesHtml = updatesConsent
    ? "<tr><td style=\"padding:18px 20px;background:#e9dfc8;border-left:3px solid #ecc779;color:#132e29;font:15px/1.6 Arial,sans-serif\">You also asked for occasional email updates from Dr. Loren, but we couldn’t send the confirmation link. You are not subscribed yet. Please <a href=\"mailto:hello@fromsplinteredtocentered.com\" style=\"color:#132e29\">contact the book team</a> if you still want to join his list.</td></tr>"
    : "";
  return {
    from: { name: "From Splintered to Centered", address: mailbox },
    to: { name, address: email },
    replyTo: { name: "From Splintered to Centered", address: mailbox },
    subject: `We received your request for ${copies} — From Splintered to Centered`,
    text: `Hello ${name},\n\nYour request for ${copies} of From Splintered to Centered has been received. No payment has been taken. Our team will follow up by email with pricing and availability.${updatesNote}\n\nThank you,\nThe From Splintered to Centered team\n\nFrom Splintered to Centered\n${siteUrl}\nhello@fromsplinteredtocentered.com`,
    html: `<!doctype html><html><body style="margin:0;padding:0;background:#061b21"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#061b21"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f1e9d5"><tr><td style="padding:22px 28px;background:#132e29;border-bottom:3px solid #ecc779"><a href="${siteUrl}" style="color:#f1e9d5;text-decoration:none;font:600 15px/1.2 Georgia,serif;letter-spacing:2px">FROM SPLINTERED<br><span style="color:#ecc779">TO CENTERED</span></a></td></tr><tr><td style="padding:28px 28px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="112" valign="top" style="padding-right:20px"><a href="${siteUrl}" style="text-decoration:none"><img src="${coverUrl}" width="92" alt="From Splintered to Centered book cover" style="display:block;width:92px;height:auto;border:1px solid #c5a761"></a></td><td valign="middle"><p style="margin:0 0 8px;color:#8a6d37;font:600 11px/1.4 Arial,sans-serif;letter-spacing:2px">A JOURNEY BACK TO YOURSELF</p><p style="margin:0;color:#132e29;font:24px/1.15 Georgia,serif">From Splintered<br>to Centered</p><p style="margin:10px 0 0;color:#46534b;font:13px/1.5 Arial,sans-serif">By Dr. Sanjiv Chopra and Dr. Loren Michaels Harris</p></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px"><tr><td style="padding-top:20px;border-top:1px solid #d7c9a7"><p style="margin:0 0 10px;color:#8a6d37;font:600 11px/1.4 Arial,sans-serif;letter-spacing:2px">COPY REQUEST RECEIVED</p><p style="margin:0 0 14px;color:#132e29;font:26px/1.15 Georgia,serif">Thank you, ${safeName}.</p><p style="margin:0 0 14px;color:#263b34;font:16px/1.65 Arial,sans-serif">Your request for <strong>${quantity} ${quantity === 1 ? "copy" : "copies"}</strong> of <em>From Splintered to Centered</em> has been received.</p><p style="margin:0;color:#263b34;font:15px/1.65 Arial,sans-serif">No payment has been taken. Our team will follow up by email with pricing and availability.</p></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">${updatesHtml}</table><p style="margin:24px 0 0"><a href="${siteUrl}" style="display:inline-block;padding:11px 16px;background:#132e29;color:#f1e9d5;text-decoration:none;font:600 12px/1.3 Arial,sans-serif;letter-spacing:1px">EXPLORE THE BOOK</a></p></td></tr><tr><td style="padding:18px 28px;background:#e9dfc8;border-top:1px solid #d7c9a7;color:#526056;font:12px/1.6 Arial,sans-serif">From Splintered to Centered<br><a href="${siteUrl}" style="color:#132e29">fromsplinteredtocentered.com</a> · <a href="mailto:hello@fromsplinteredtocentered.com" style="color:#132e29">Contact the book team</a></td></tr></table></td></tr></table></body></html>`,
  };
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(siteConfig.canonicalUrl).origin) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }
  const raw = await request.text();
  if (raw.length > 4096) return Response.json({ error: "Request too large" }, { status: 413 });
  let data;
  try { data = JSON.parse(raw); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  if (!data || typeof data !== "object") return Response.json({ error: "Invalid request" }, { status: 400 });
  if (data.website) return Response.json({ ok: true });
  const { name, email, quantity, consent } = data;
  const updatesConsent = data.updatesConsent === true;
  const requestedSource = typeof data.source === "string" ? data.source : "direct";
  const source = ["main-site", "dr-loren-website", "dr-sanjiv-website"].includes(requestedSource)
    ? requestedSource
    : "direct";
  if (typeof name !== "string" || !name.trim() || name.length > 120 || /[\r\n]/.test(name) ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isInteger(quantity) || quantity < 1 || quantity > 100 || consent !== true ||
      (data.updatesConsent !== undefined && typeof data.updatesConsent !== "boolean")) {
    return Response.json({ error: "Please check your details" }, { status: 400 });
  }
  if (!process.env.SMTP_PASSWORD) return Response.json({ error: "Email unavailable" }, { status: 503 });
  const now = Date.now();
  attempts.forEach((expiry, key) => { if (expiry <= now) attempts.delete(key); });
  const key = email.toLowerCase();
  if (attempts.has(key) || attempts.size >= 1000) return Response.json({ error: "Please try again later" }, { status: 429 });
  attempts.set(key, now + 60_000);
  let preorderSaved = false;
  let updatesConfirmationSent = false;
  let updatesConfirmationOutcomeUnknown = false;
  let brevoFailure = "";
  try {
    const result = await syncPreorderToBrevo({
      name: name.trim(),
      email: email.trim(),
      quantity,
      source,
      updatesConsent,
    });
    preorderSaved = result.preorderSaved;
    updatesConfirmationSent = result.updatesConfirmationSent;
  } catch (error) {
    preorderSaved = error instanceof BrevoSyncError && error.preorderSaved;
    updatesConfirmationOutcomeUnknown = error instanceof BrevoSyncError && error.updatesEmailOutcome === "unknown";
    brevoFailure = error instanceof BrevoSyncError ? error.message : "Unexpected Brevo sync error";
    console.error("Preorder Brevo sync failed", { reason: brevoFailure });
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.titan.email",
    port: 465,
    secure: true,
    auth: { user: mailbox, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
  let requesterReceiptSent = updatesConsent && updatesConfirmationSent;
  const requesterEmailOutcomeUnknown = updatesConsent && updatesConfirmationOutcomeUnknown;
  let teamNotificationSent = false;
  try {
    if (!requesterReceiptSent && !requesterEmailOutcomeUnknown) {
      try {
        await transport.sendMail(requestReceipt(name.trim(), email.trim(), quantity, updatesConsent));
        requesterReceiptSent = true;
      } catch (error) {
        console.error("Preorder requester receipt failed", error);
      }
    }

    try {
      await transport.sendMail({
        from: { name: "From Splintered to Centered", address: mailbox },
        to: mailbox,
        replyTo: { name: name.trim(), address: email },
        subject: `New preorder request${preorderSaved ? "" : " — Brevo sync needs attention"} — From Splintered to Centered`,
        text: `Name: ${name.trim()}\nEmail: ${email}\nCopies requested: ${quantity}\nSource: ${source}\n\nThe visitor agreed to email contact about this request.\nRequester email: ${requesterReceiptSent ? "Sent" : requesterEmailOutcomeUnknown ? "Outcome unknown; no fallback sent to avoid a duplicate" : "Not sent"}\nDr. Loren updates opt-in requested: ${updatesConsent ? "Yes" : "No"}\nBrevo preorder list saved: ${preorderSaved ? "Yes" : "No"}\nDr. Loren updates confirmation: ${updatesConsent ? (updatesConfirmationSent ? "Sent" : requesterEmailOutcomeUnknown ? "Outcome unknown" : "Not sent") : "Not requested"}${brevoFailure ? `\nBrevo issue: ${brevoFailure}\nPlease add or review this request in Brevo.` : ""}\n\nNo payment collected. Pricing and availability require confirmation.`,
      });
      teamNotificationSent = true;
    } catch (error) {
      console.error("Preorder team notification failed", error);
    }

    const requestRecorded = preorderSaved || teamNotificationSent;
    if (!requestRecorded) {
      return Response.json({
        error: "Unable to confirm that the request was recorded",
        preorderSaved,
        updatesConsent,
        updatesConfirmationSent,
        updatesConfirmationOutcomeUnknown,
        requesterReceiptSent,
        teamNotificationSent,
      }, { status: 502 });
    }

    return Response.json({
      ok: true,
      preorderSaved,
      updatesConsent,
      updatesConfirmationSent,
      updatesConfirmationOutcomeUnknown,
      requesterReceiptSent,
      teamNotificationSent,
    });
  } finally { transport.close(); }
}
