import { MetadataRoute } from "next";
import { siteConfig } from "@/data/book";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteConfig.canonicalUrl}/sitemap.xml` }; }
