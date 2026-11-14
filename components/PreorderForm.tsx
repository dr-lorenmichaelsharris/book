"use client";

import { FormEvent, useState } from "react";

export type PreorderRequest = { name: string; email: string; quantity: number };

export function PreorderForm({ fallbackSource = "direct" }: { fallbackSource?: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    try {
      const source = new URLSearchParams(window.location.search).get("utm_source") ?? fallbackSource;
      const response = await fetch("/api/preorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      quantity: Number(data.get("quantity")),
      consent: data.get("consent") === "on",
      updatesConsent: data.get("updatesConsent") === "on",
      source,
      website: String(data.get("website") ?? ""),
    }) });
      const result = await response.json();
      if (!response.ok) {
        if (result.updatesConfirmationOutcomeUnknown) {
          setMessage("Your request may have been recorded, but the email service didn’t confirm whether it sent your message. Please check your inbox and spam folder before trying again, or contact hello@fromsplinteredtocentered.com.");
        } else if (result.requesterReceiptSent) {
          form.reset();
          setMessage("We emailed your receipt, but couldn’t confirm that the request was recorded for the book team. Please email hello@fromsplinteredtocentered.com before trying again.");
        } else {
          setMessage(result.preorderSaved
            ? "Your request may already be recorded, but we couldn’t send your receipt email. Please email hello@fromsplinteredtocentered.com before trying again."
            : "We couldn’t confirm that your request was received. Please try again or email hello@fromsplinteredtocentered.com.");
        }
        return;
      }
      form.reset();
      if (result.updatesConfirmationOutcomeUnknown) {
        setMessage("Your request was recorded. We attempted one email with your receipt and the updates confirmation, but the email service didn’t confirm whether it went out. Please check your inbox and spam folder before contacting us.");
      } else if (!result.requesterReceiptSent) {
        setMessage(result.teamNotificationSent
          ? result.updatesConsent
            ? "The book team received your request, but we couldn’t email your receipt or updates confirmation. You aren’t subscribed to Dr. Loren’s updates. Please email hello@fromsplinteredtocentered.com if you need help."
            : "The book team received your request, but we couldn’t email your receipt. Please email hello@fromsplinteredtocentered.com if you need a copy."
          : result.updatesConsent
            ? "Your request was saved, but we couldn’t email your receipt or updates confirmation. You aren’t subscribed to Dr. Loren’s updates. Please email hello@fromsplinteredtocentered.com."
            : "Your request was saved, but we couldn’t email your receipt or alert the book team. Please email hello@fromsplinteredtocentered.com.");
      } else if (result.updatesConsent && !result.updatesConfirmationSent) {
        setMessage("Your request receipt is on its way. We couldn’t send the link to confirm Dr. Loren’s updates, so you aren’t subscribed yet. Please email hello@fromsplinteredtocentered.com if you’d like help.");
      } else if (result.updatesConfirmationSent) {
        setMessage("Your request receipt is on its way in one email. It also has a separate button to confirm Dr. Loren’s occasional updates. No payment was collected.");
      } else if (!result.preorderSaved || !result.teamNotificationSent) {
        setMessage("Your request receipt is on its way, but the book team’s reader list or notification needs attention. Please email hello@fromsplinteredtocentered.com if you need help.");
      } else {
        setMessage("Your request receipt is on its way. The email confirms the requested copies; no payment was collected. Our team will follow up with pricing and availability.");
      }
    } catch {
      setMessage("We couldn’t send your request. Please try again or email hello@fromsplinteredtocentered.com.");
    } finally { setPending(false); }
  }

  return <form className="preorder-form" onSubmit={submit}>
    <p className="newsletter-status">Request your copy of From Splintered to Centered. No payment is collected. Pricing and availability will be confirmed by email.</p>
    <div className="fields">
      <label>Full name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>Number of copies<input name="quantity" type="number" min={1} max={100} step={1} defaultValue={1} required /></label>
    </div>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input name="consent" type="checkbox" required /><span>Please contact me by email about this preorder request.</span></label>
    <label className="consent updates-consent"><input name="updatesConsent" type="checkbox" /><span>I’d also like occasional email updates from Dr. Loren about his work, reflections, conversations, and book news. I can unsubscribe at any time.</span></label>
    <button className="button" type="submit" disabled={pending}>{pending ? "Sending…" : "Request a preorder"}<span aria-hidden="true">↗</span></button>
    <p className="form-note" role="status" aria-live="polite">{message}</p>
  </form>;
}
