import { Menu } from "./ClientBits";
import { Mark } from "./Sections";
import { siteConfig } from "@/data/book";
export function Header(){return <header className="site-header"><a className="wordmark" href="#book"><Mark/><span>From Splintered<br/><em>to Centered</em></span></a><Menu/></header>;}
export function Footer(){return <footer className="footer"><a className="wordmark" href="#book"><Mark/><span>From Splintered<br/><em>to Centered</em></span></a><nav aria-label="Footer"><a href="#dimensions">The dimensions</a><a href="#authors">The authors</a><a href="#centered-voices">Centered Voices</a><a href={siteConfig.contactUrl}>Contact</a></nav><p className="disclaimer">For education and inspiration. This book and website do not replace individualized medical, psychological, or other professional care.</p><small>© {new Date().getFullYear()} From Splintered to Centered</small></footer>;}
