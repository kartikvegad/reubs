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
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
      className={`site-header sticky top-0 z-40 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        overHero
          ? "border-transparent bg-transparent"
          : scrolled
            ? "border-b border-gold-soft/70 bg-paper/92 shadow-[0_12px_40px_-24px_rgba(78,18,25,0.55)] backdrop-blur-xl"
            : "border-b border-gold-soft/50 bg-paper/90 backdrop-blur-md"
      } ${overHero ? "is-over-hero" : ""}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-5">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold tracking-[0.14em] transition-transform duration-300 group-hover:scale-[1.05] ${
              overHero ? "bg-gold text-maroon-deep" : "bg-maroon text-gold"
            }`}
          >
            R
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate font-display text-lg leading-none transition-colors duration-300 sm:text-xl ${
                overHero ? "text-paper" : "text-maroon-deep group-hover:text-maroon"
              }`}
            >
              {school.shortName}
            </span>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.18em] sm:block ${
                overHero ? "text-gold-soft/80" : "text-muted"
              }`}
            >
              Maninagar · Ahmedabad
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {primary.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${overHero ? "nav-link--light" : ""} ${active ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className={`nav-link inline-flex items-center gap-1 ${overHero ? "nav-link--light" : ""} ${
                moreActive || moreOpen ? "is-active" : ""
              }`}
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
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <span
              className={`absolute h-0.5 w-5 transition-all duration-300 ${
                overHero && !open ? "bg-paper" : "bg-ink"
              } ${open ? "translate-y-0 rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-0.5 w-5 transition-all duration-300 ${
                overHero && !open ? "bg-paper" : "bg-ink"
              } ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute h-0.5 w-5 transition-all duration-300 ${
                overHero && !open ? "bg-paper" : "bg-ink"
              } ${open ? "translate-y-0 -rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-paper transition-[opacity,visibility] duration-300 sm:top-[4.25rem] xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="mx-auto flex h-full max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-6 sm:px-5">
          {all.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-3.5 text-lg transition-colors duration-200 ${
                  active ? "bg-cream text-maroon" : "text-ink/85 hover:bg-cream hover:text-maroon"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
