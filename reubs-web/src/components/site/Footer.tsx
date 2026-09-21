"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { school } from "@/lib/school";

const columns = [
  {
    title: "School",
    links: [
      ["/about", "About"],
      ["/academics", "Academics"],
      ["/campus", "Campus"],
      ["/faculty", "Faculty"],
      ["/admissions", "Admissions"],
    ],
  },
  {
    title: "Campus life",
    links: [
      ["/life", "Student life"],
      ["/events", "Events"],
      ["/gallery", "Gallery"],
      ["/news", "News"],
      ["/achievements", "Achievements"],
    ],
  },
  {
    title: "Families",
    links: [
      ["/parents", "Parents & students"],
      ["/contact", "Contact"],
      ["/policies", "Policies"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/scan") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-gold-soft/40 bg-maroon-deep text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-5 sm:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="max-w-md shrink-0 md:max-w-sm lg:max-w-md">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-semibold tracking-[0.12em] text-maroon-deep transition-transform duration-300 group-hover:scale-[1.04]">
                R
              </span>
              <span>
                <span className="block font-display text-xl leading-none text-paper sm:text-2xl">
                  {school.shortName}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-gold-soft">
                  CBSE · Maninagar
                </span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-gold-soft">
              An English-medium campus where education, character and future readiness grow together.
            </p>

            <dl className="mt-7 space-y-4 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-gold">Visit</dt>
                <dd className="mt-1 leading-6 text-gold-soft">{school.address}</dd>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-gold">Call</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${school.phone.replace(/\s/g, "")}`}
                      className="text-paper transition-colors duration-200 hover:text-gold"
                    >
                      {school.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-gold">Email</dt>
                  <dd className="mt-1 break-all">
                    <a
                      href={`mailto:${school.email}`}
                      className="text-paper transition-colors duration-200 hover:text-gold"
                    >
                      {school.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-gold">Office</dt>
                <dd className="mt-1 text-gold-soft">{school.hours}</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link href="/admissions" className="btn-gold text-sm">
                Admission enquiry
              </Link>
              <Link href="/events" className="btn-secondary text-sm">
                Book seats
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold">{col.title}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-gold-soft">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-block transition-colors duration-200 hover:text-paper"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-gold-soft sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>
            © {new Date().getFullYear()} {school.shortName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-paper">
              Terms
            </Link>
            <Link href="/policies" className="transition-colors duration-200 hover:text-paper">
              Policies
            </Link>
            <span className="hidden h-3 w-px bg-white/20 sm:inline-block" aria-hidden />
            <Link href="/scan" className="transition-colors duration-200 hover:text-paper">
              Gate scanner
            </Link>
            <Link href="/admin" className="transition-colors duration-200 hover:text-paper">
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
