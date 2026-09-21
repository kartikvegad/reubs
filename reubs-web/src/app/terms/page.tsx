import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">Terms</h1>
      <p className="mt-6 leading-8 text-muted">
        This website is an information and event-booking service for Reubs Primary & Higher
        Secondary School, Maninagar. Event passes are issued only to verified current students.
        Seat maps, prices and programme details can change until the office confirms a circular.
      </p>
      <p className="mt-4 leading-8 text-muted">
        A full terms of use document will replace this page when the school’s legal text is ready.
        Until then, the office remains the authority on admissions, fees, attendance and discipline.
      </p>
    </main>
  );
}
