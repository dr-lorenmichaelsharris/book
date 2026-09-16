"use client";

import { FormEvent, useState } from "react";

export type PreorderRequest = { name: string; email: string; quantity: number };

export function PreorderForm() {
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
      const response = await fetch("/api/preorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      quantity: Number(data.get("quantity")),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    }) });
      if (!response.ok) throw new Error("Submission failed");
      setMessage("Your preorder request has been received. We’ll email you with pricing and availability.");
      form.reset();
    } catch {
      setMessage("We couldn’t send your request. Please try again or email hello@fromsplinteredtocentered.com.");
    } finally { setPending(false); }
  }

  return <form onSubmit={submit}>
    <p className="newsletter-status">Request your copy of From Splintered to Centered. No payment is collected. Pricing and availability will be confirmed by email.</p>
    <div className="fields">
      <label>Full name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>Number of copies<input name="quantity" type="number" min={1} max={100} step={1} defaultValue={1} required /></label>
    </div>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input name="consent" type="checkbox" required /><span>Please contact me by email about this preorder request.</span></label>
    <button className="button" type="submit" disabled={pending}>{pending ? "Sending…" : "Request a preorder"}<span aria-hidden="true">↗</span></button>
    <p className="form-note" role="status">{message}</p>
  </form>;
}
