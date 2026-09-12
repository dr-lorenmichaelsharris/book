"use client";
import { FormEvent, useEffect, useState } from "react";

export function track(event: string) { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("book:analytics", { detail: { event } })); }

export function Menu() {
  const [open, setOpen] = useState(false);
  const links = [["The Book", "#book"], ["The 7 Dimensions", "#dimensions"], ["The Authors", "#authors"], ["Videos", "#videos"]];
  return <><button className="menu" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}><span /><span /><span /><b className="sr-only">Menu</b></button><nav id="navigation" className={open ? "open" : ""} aria-label="Primary">{links.map(([l,h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}<a className="nav-cta" href="#join">Join the conversation</a></nav></>;
}

export function VideoButton({ author, url }: { author: string; url: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); addEventListener("keydown", close); return () => removeEventListener("keydown", close); }, [open]);
  return <>{<button className="play" onClick={() => { if (url) { setOpen(true); track(`author_video_${author}_played`); } }} aria-label={`Play ${author}'s welcome video`} disabled={!url}><span>▶</span>{url ? "Watch welcome" : "Video coming soon"}</button>}{open && <div className="modal" role="dialog" aria-modal="true" aria-label={`${author} welcome video`} onClick={() => setOpen(false)}><div onClick={e => e.stopPropagation()}><button className="close" onClick={() => setOpen(false)}>Close ×</button><iframe src={url} title={`${author} welcome video`} allow="autoplay; fullscreen" /></div></div>}</>;
}

export function Newsletter() {
  const [message, setMessage] = useState("");
  function submit(e: FormEvent) { e.preventDefault(); track("newsletter_submitted"); setMessage("Thank you. Sign-up will open when our mailing service is connected."); }
  return <form onSubmit={submit}><div className="fields"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Email address<input type="email" name="email" autoComplete="email" required /></label><button type="submit">Join the Book Community <span>↗</span></button></div><label className="consent"><input type="checkbox" required /> <span>By subscribing, you agree to receive updates related to the book. You may unsubscribe at any time.</span></label><p className="form-note" aria-live="polite">{message}</p>{/* TODO: Replace placeholder handler with the selected email provider API/action. */}</form>;
}
