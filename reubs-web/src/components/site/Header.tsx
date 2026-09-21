"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { school } from "@/lib/school";

const primary = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/campus", label: "Campus" },
  { href: "/life", label: "Student life" },
  { href: "/events", label: "Events" },
  { href: "/admissions", label: "Admissions" },
];

const more = [
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/faculty", label: "Faculty" },
  { href: "/achievements", label: "Achievements" },
  { href: "/parents", label: "Parents & students" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  if (pathname.startsWith("/scan") || pathname.startsWith("/admin")) return null;

  const all = [...primary, ...more];

  return (
    <header className="sticky top-0 z-40 border-b border-gold-soft/70 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-maroon text-sm font-semibold tracking-[0.12em] text-gold">
            R
          </span>
          <span>
            <span className="block font-display text-lg leading-none text-maroon-deep">{school.shortName}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">CBSE · Ahmedabad</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          {primary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm ${pathname === link.href ? "text-maroon" : "text-ink/80 hover:text-maroon"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button type="button" className="text-sm text-ink/80" onClick={() => setMoreOpen((v) => !v)}>
              More
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-full mt-2 w-52 border border-gold-soft bg-paper p-2 shadow-sm">
                {more.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 text-sm hover:bg-cream"
                    onClick={() => setMoreOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/events" className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">
            Book seats
          </Link>
        </nav>

        <button type="button" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-gold-soft px-5 py-3 lg:hidden">
          {all.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
