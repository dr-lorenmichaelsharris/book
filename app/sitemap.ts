import { MetadataRoute } from "next";
import { siteConfig } from "@/data/book";
export default function sitemap(): MetadataRoute.Sitemap { return [
  { url: siteConfig.canonicalUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  { url: `${siteConfig.canonicalUrl}/preorder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
]; }
