import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Updates Confirmed | From Splintered to Centered",
  robots: { index: false, follow: false },
};

export default function PreorderConfirmedPage() {
  return <main className="preorder-confirmed">
    <Link className="wordmark" href="/">
      <span className="mark" aria-hidden="true">✺</span>
      <span>From Splintered<br/><em>to Centered</em></span>
    </Link>
    <section aria-labelledby="confirmation-title">
      <p className="eyebrow">You’re connected</p>
      <h1 id="confirmation-title">Thank you for confirming.</h1>
      <p>You’ll receive occasional email updates from Dr. Loren about his work, reflections, conversations, and book news. Your preorder request remains separate; no payment has been collected.</p>
      <Link className="button" href="/">Return to the book website <span aria-hidden="true">↗</span></Link>
    </section>
  </main>;
}
