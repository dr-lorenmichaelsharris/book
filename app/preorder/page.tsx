import type { Metadata } from "next";
import Link from "next/link";
import { PreorderForm } from "@/components/PreorderForm";
import { siteConfig } from "@/data/book";

export const metadata: Metadata = {
  title: "Request a Copy | From Splintered to Centered",
  description: "Request a copy of From Splintered to Centered by Dr. Sanjiv Chopra and Dr. Loren Michaels Harris. No payment is collected.",
  alternates: { canonical: "/preorder" },
  openGraph: {
    title: "From Splintered to Centered — Request a Copy",
    description: "A journey back to yourself. Request a copy of the book by Dr. Sanjiv Chopra and Dr. Loren Michaels Harris.",
    type: "book",
    url: "/preorder",
    images: [siteConfig.images.cover],
  },
  twitter: { card: "summary_large_image", title: "From Splintered to Centered — Request a Copy", images: [siteConfig.images.cover] },
};

export default function PreorderPage() {
  return <main className="preorder-page">
    <header className="preorder-header">
      <Link className="wordmark" href="/" aria-label="From Splintered to Centered home">
        <span className="mark" aria-hidden="true">✺</span>
        <span>From Splintered<br/><em>to Centered</em></span>
      </Link>
      <Link className="preorder-home-link" href="/#journey">Explore the book <span aria-hidden="true">↗</span></Link>
    </header>

    <section className="preorder-layout" aria-labelledby="preorder-title">
      <figure className="preorder-cover">
        <img src={siteConfig.images.cover} alt="Book cover: From Splintered to Centered — 7 Dimensions for Navigating Your Soul, by Dr. Sanjiv Chopra and Dr. Loren Michaels Harris" width="700" height="1050" fetchPriority="high" />
        <figcaption>Two journeys. One invitation to come back to center.</figcaption>
      </figure>

      <div className="preorder-copy">
        <p className="eyebrow">A journey back to yourself</p>
        <h1 id="preorder-title">From Splintered<br/><em>to Centered</em></h1>
        <p className="preorder-subtitle">7 Dimensions for Navigating Your Soul</p>
        <p className="preorder-byline">By Dr. Sanjiv Chopra and Dr. Loren Michaels Harris</p>
        <p className="preorder-description">Beyond achievement. Beneath the noise. This book explores purpose, connection, healing, service, love, and legacy—and invites you toward a more meaningful life.</p>
        <div className="preorder-request">
          <h2>Request your copy</h2>
          <p>Share your details and we’ll follow up by email with pricing and availability. This request does not collect payment or confirm a paid order.</p>
          <PreorderForm />
        </div>
        <Link className="preorder-back-link" href="/">Return to the book website</Link>
      </div>
    </section>

    <footer className="preorder-footer">
      <span>© {new Date().getFullYear()} From Splintered to Centered</span>
      <Link href="mailto:hello@fromsplinteredtocentered.com">Contact the book team</Link>
    </footer>
  </main>;
}
