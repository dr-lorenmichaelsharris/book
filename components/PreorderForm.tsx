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
        setMessage(result.preorderSaved
          ? "Your request may already be recorded, but we couldn’t finish sending it to the preorder team. Please email hello@fromsplinteredtocentered.com before trying again."
          : "We couldn’t send your request. Please try again or email hello@fromsplinteredtocentered.com.");
        return;
      }
      if (!result.preorderSaved) {
        setMessage(result.updatesConsent
          ? "Your preorder request was received, but we couldn’t complete your signup for Dr. Loren’s email updates. The preorder team has been alerted; please email hello@fromsplinteredtocentered.com if you need help."
          : "Your preorder request was received. The preorder team has been alerted that the reader list needs attention.");
      } else if (result.updatesConsent && !result.updatesConfirmationSent) {
        setMessage("Your preorder request was received, but we couldn’t send the confirmation email for Dr. Loren’s updates. Please email hello@fromsplinteredtocentered.com if you’d like to join his list.");
      } else if (result.updatesConfirmationSent) {
        setMessage("Your preorder request was received. Check your inbox for a separate email to confirm Dr. Loren’s occasional email updates. No payment is collected.");
      } else {
        setMessage("Your preorder request has been received. We’ll email you with pricing and availability. No payment is collected.");
      }
      form.reset();
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
