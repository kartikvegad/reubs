import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "School policies" };

export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-maroon">Important information</p>
      <h1 className="mt-3 font-display text-5xl">School policies</h1>
      <p className="mt-6 leading-8 text-muted">
        Attendance, uniform, transport, discipline, child safety and assessment policies will be
        published here as documents issued by the office. Until then, please ask at the desk for the
        current circular.
      </p>
      <ul className="mt-8 space-y-2 text-muted">
        <li>[Attendance policy — PDF]</li>
        <li>[Uniform guidelines — PDF]</li>
        <li>[Transport rules — PDF]</li>
        <li>[Child protection / POSH-aligned campus note — PDF]</li>
        <li>[Assessment & promotion — PDF]</li>
      </ul>
      <Link href="/contact" className="mt-10 inline-block text-maroon">
        Contact the office
      </Link>
    </main>
  );
}
