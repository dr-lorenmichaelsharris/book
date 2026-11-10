import nodemailer from "nodemailer";
import { siteConfig } from "@/data/book";
import { BrevoSyncError, syncPreorderToBrevo } from "@/lib/brevo";

export const runtime = "nodejs";
const attempts = new Map<string, number>();
const mailbox = "hello@fromsplinteredtocentered.com";

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
  try {
    await transport.sendMail({
      from: { name: "From Splintered to Centered", address: mailbox },
      to: mailbox,
      replyTo: { name: name.trim(), address: email },
      subject: `New preorder request${preorderSaved ? "" : " — Brevo sync needs attention"} — From Splintered to Centered`,
      text: `Name: ${name.trim()}\nEmail: ${email}\nCopies requested: ${quantity}\nSource: ${source}\n\nThe visitor agreed to email contact about this request.\nDr. Loren updates opt-in requested: ${updatesConsent ? "Yes" : "No"}\nBrevo preorder list saved: ${preorderSaved ? "Yes" : "No"}\nDr. Loren updates confirmation: ${updatesConsent ? (updatesConfirmationSent ? "Sent" : "Not sent") : "Not requested"}${brevoFailure ? `\nBrevo issue: ${brevoFailure}\nPlease add or review this request in Brevo.` : ""}\n\nNo payment collected. Pricing and availability require confirmation.`,
    });
    return Response.json({ ok: true, preorderSaved, updatesConsent, updatesConfirmationSent });
  } catch {
    return Response.json({ error: "Unable to send email", preorderSaved }, { status: 502 });
  } finally { transport.close(); }
}
