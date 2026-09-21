"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { school } from "@/lib/school";

const columns = [
  {
    title: "The school",
    links: [
      ["/", "Home"],
      ["/about", "About"],
      ["/academics", "Academics"],
      ["/campus", "Campus"],
      ["/faculty", "Faculty"],
    ],
  },
  {
    title: "Life & events",
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
      ["/admissions", "Admissions"],
      ["/parents", "Parents & students"],
      ["/contact", "Contact"],
      ["/policies", "School policies"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/scan")) return null;

  return (
    <footer className="mt-auto border-t border-gold-soft bg-maroon-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-display text-3xl">{school.name}</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-gold-soft">
              A CBSE-oriented English-medium campus in Maninagar, Ahmedabad — where education,
              character, confidence, creativity and future readiness come together.
            </p>
            <p className="mt-6 text-sm text-gold-soft">{school.address}</p>
            <p className="mt-2 text-sm">{school.phone}</p>
            <p className="text-sm">{school.email}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{col.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-gold-soft">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gold-soft">
          <p>© {new Date().getFullYear()} {school.shortName}, Maninagar, Ahmedabad</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/policies">School policies</Link>
            <Link href="/parents">Important information</Link>
            <span>[Instagram]</span>
            <span>[Facebook]</span>
            <span>[YouTube]</span>
            <Link href="/scan">Gate scanner</Link>
            <Link href="/admin">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
