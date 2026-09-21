import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Parents & students" };

export default function ParentsPage() {
  return (
    <main>
      <section className="relative min-h-[40vh]">
        <Photo src={img.parents} alt="Family on campus" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-paper">
          <Eyebrow>Information hub</Eyebrow>
          <h1 className="mt-3 font-display text-5xl">For parents and students</h1>
          <p className="mt-4 max-w-2xl text-lg text-gold-soft">
            Practical links for the school week, notices, events, meetings and the documents the
            office issues. Circulars from the desk take precedence until live files are uploaded here.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
        <article className="border border-gold-soft bg-paper p-8">
          <h2 className="font-display text-3xl">For parents</h2>
          <p className="mt-3 leading-7 text-muted">
            Start here for the public life of the school. For a child’s marks, attendance or a
            transport query, call the office during working hours.
          </p>
          <ul className="mt-6 space-y-3 text-maroon">
            <li><Link href="/news">Notices & announcements</Link></li>
            <li><Link href="/events">Events & pass booking</Link></li>
            <li><Link href="/contact">Parent meetings: ask the office for dates</Link></li>
            <li><Link href="/policies">School policies</Link></li>
            <li><Link href="/contact">Important documents: [to be uploaded]</Link></li>
            <li><Link href="/contact">Contact information</Link></li>
            <li><span className="text-muted">Academic calendar: [PDF to be added]</span></li>
          </ul>
        </article>
        <article className="border border-gold-soft bg-paper p-8">
          <h2 className="font-display text-3xl">For students</h2>
          <p className="mt-3 leading-7 text-muted">
            The week’s work lives in the classroom. This list is for events, clubs and the campus
            calendar you can share at home.
          </p>
          <ul className="mt-6 space-y-3 text-maroon">
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/life">Competitions & activities</Link></li>
            <li><Link href="/news">Announcements</Link></li>
            <li><Link href="/life">Clubs</Link></li>
            <li><Link href="/academics">Academic resources: [to be added]</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/achievements">Achievements</Link></li>
          </ul>
        </article>
      </section>
      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl">How to use this hub</h2>
          <Note>Replace any line when the office publishes a live document or date.</Note>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="border border-gold-soft p-6">
              <h3 className="font-display text-2xl">Notices</h3>
              <p className="mt-3 leading-7 text-muted">
                News carries sample announcements. When a circular is issued, it should appear there
                with a date and a short summary.
              </p>
            </article>
            <article className="border border-gold-soft p-6">
              <h3 className="font-display text-2xl">Event passes</h3>
              <p className="mt-3 leading-7 text-muted">
                Annual Day, sports meet and exhibitions use enrollment-verified seats. A parent books
                with the student’s number and shows the QR code at the gate.
              </p>
            </article>
            <article className="border border-gold-soft p-6">
              <h3 className="font-display text-2xl">Policies</h3>
              <p className="mt-3 leading-7 text-muted">
                Uniform, transport, attendance and safety notes will live as PDFs under School
                policies. Until then, request the current circular at the desk.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
