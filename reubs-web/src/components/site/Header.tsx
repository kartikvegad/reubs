"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { school } from "@/lib/school";

const primary = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/events", label: "Events" },
  { href: "/admissions", label: "Admissions" },
];

const more = [
  { href: "/campus", label: "Campus" },
  { href: "/life", label: "Student life" },
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
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/scan") || pathname.startsWith("/admin")) return null;

  const all = [...primary, ...more];
  const moreActive = more.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-gold-soft/80 bg-paper/95 shadow-[0_10px_30px_-18px_rgba(78,18,25,0.45)]"
          : "border-gold-soft/50 bg-paper/90"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-5">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-maroon text-xs font-semibold tracking-[0.12em] text-gold transition-transform duration-300 group-hover:scale-[1.04] sm:h-10 sm:w-10 sm:text-sm">
            R
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-none text-maroon-deep transition-colors duration-300 group-hover:text-maroon sm:text-lg">
              {school.shortName}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted sm:block">
              CBSE · Ahmedabad
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {primary.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`nav-link ${active ? "is-active" : ""}`}>
                {link.label}
              </Link>
            );
          })}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className={`nav-link inline-flex items-center gap-1 ${moreActive || moreOpen ? "is-active" : ""}`}
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More
              <span
                className={`inline-block text-[10px] transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            <div
              className={`absolute right-0 top-full z-50 mt-2 w-52 origin-top-right border border-gold-soft bg-paper p-2 shadow-[0_18px_40px_-24px_rgba(27,20,16,0.55)] transition-all duration-200 ${
                moreOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
              }`}
            >
              {more.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-sm px-3 py-2 text-sm transition-colors duration-200 ${
                      active ? "bg-cream text-maroon" : "text-ink/85 hover:bg-cream hover:text-maroon"
                    }`}
                    onClick={() => setMoreOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <Link href="/events" className="btn-primary ml-2 px-4 py-2 text-sm">
            Book seats
          </Link>
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <Link href="/events" className="btn-primary hidden px-3.5 py-2 text-xs sm:inline-flex">
            Book seats
          </Link>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <span
              className={`absolute h-0.5 w-5 bg-ink transition-all duration-300 ${
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-ink transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 bg-ink transition-all duration-300 ${
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-40 bg-paper transition-[opacity,visibility] duration-300 sm:top-16 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="mx-auto flex h-full max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-5 sm:px-5">
          {all.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-3 text-base transition-colors duration-200 ${
                  active ? "bg-cream text-maroon" : "text-ink/85 hover:bg-cream hover:text-maroon"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/events"
            className="btn-primary mt-4 inline-flex w-full justify-center px-4 py-3 text-sm sm:hidden"
            onClick={() => setOpen(false)}
          >
            Book seats
          </Link>
        </nav>
      </div>
    </header>
  );
}
