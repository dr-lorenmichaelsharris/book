import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/book";

export const metadata: Metadata = { metadataBase: new URL(siteConfig.canonicalUrl), title: "From Splintered to Centered | Dr. Sanjiv Chopra & Dr. Loren Michaels Harris", description: "Discover From Splintered to Centered: 7 Dimensions for Navigating Your Soul, a new book exploring purpose, connection, healing, service, love, legacy, and the journey toward a more centered life.", alternates: { canonical: "/" }, openGraph: { title: "From Splintered to Centered", description: "7 Dimensions for Navigating Your Soul", type: "book", url: "/" }, twitter: { card: "summary_large_image", title: "From Splintered to Centered", description: "7 Dimensions for Navigating Your Soul" } };
const structuredData = { "@context": "https://schema.org", "@type": "Book", name: "From Splintered to Centered", alternateName: "7 Dimensions for Navigating Your Soul", author: [{ "@type": "Person", name: "Dr. Sanjiv Chopra" }, { "@type": "Person", name: "Dr. Loren Michaels Harris" }] };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} /></body></html> }
