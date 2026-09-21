import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Admissions" };

const steps = [
  ["Enquiry", "Write or call. Tell us the class you are considering and a little about the child."],
  ["Information & counselling", "A visit or a conversation with the coordinator for that stage. Walk the campus if you can."],
  ["Application", "Submit the form the office issues for the session. [Form — to be uploaded.]"],
  ["Interaction / assessment", "Where the school uses an interaction or age-appropriate task, it is explained in advance — not a surprise test for the youngest."],
  ["Documentation", "Birth certificate, photographs, previous report where applicable. [Exact list — office.]"],
  ["Admission confirmation", "A written offer, fee circular and joining date if a seat is given. We do not publish fees here until the school confirms them."],
];

export default function AdmissionsPage() {
  return (
    <main>
      <section className="relative min-h-[44vh]">
        <Photo src={img.corridor} alt="Campus corridor" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-maroon-deep/70" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-paper">
          <Eyebrow>Admissions</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl">Begin with an enquiry, not a rumour about seats</h1>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="max-w-3xl text-lg leading-8 text-muted">
          Admissions at Reubs are handled by the office in Maninagar. Dates, fees, eligibility and
          document lists change by session. They are not printed here as facts until the school
          supplies them.
        </p>
        <Note>Admission dates, fee circular, age criteria — to be confirmed</Note>
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {steps.map(([title, copy], index) => (
            <li key={title} className="border border-gold-soft bg-paper p-6">
              <p className="font-display text-4xl text-gold">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-2xl">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{copy}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-maroon px-5 py-3 text-paper">
            Enquire now
          </Link>
          <a href="#enquiry" className="rounded-full border border-maroon px-5 py-3 text-maroon">
            Admission enquiry
          </a>
          <Link href="/contact" className="rounded-full border border-gold-soft px-5 py-3">
            Contact admissions
          </Link>
        </div>
      </section>
      <section id="enquiry" className="bg-paper py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">Admission enquiry</h2>
            <p className="mt-4 leading-7 text-muted">
              Use this form and mark your message as an admission enquiry. The office will reply
              during working hours.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
