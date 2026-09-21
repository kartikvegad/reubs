import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { FaqList } from "@/components/site/FaqList";
import { Eyebrow } from "@/components/site/Photo";
import { school } from "@/lib/school";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const map = `https://maps.google.com/maps?q=${encodeURIComponent(school.mapsQuery)}&z=16&output=embed`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Reach us</Eyebrow>
      <h1 className="mt-3 font-display text-5xl">Contact</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3 leading-7">
          <p className="text-lg">{school.address}</p>
          <p>Office: {school.phone}</p>
          <p>Alternate: {school.phoneAlt}</p>
          <p>Email: {school.email}</p>
          <p>Admissions: {school.email} · [Dedicated admissions number — to be added]</p>
          <p className="text-muted">{school.hours} · Sunday closed</p>
          <p className="text-sm text-muted">
            Social: [Instagram] [Facebook] [YouTube] — add official handles when the school confirms them.
          </p>
          <iframe title="Map of Reubs School, Maninagar" src={map} className="mt-6 min-h-[280px] w-full border-0" />
        </div>
        <ContactForm />
      </div>
      <section className="mt-20">
        <h2 className="font-display text-4xl">Frequently asked questions</h2>
        <div className="mt-8">
          <FaqList />
        </div>
      </section>
    </main>
  );
}
