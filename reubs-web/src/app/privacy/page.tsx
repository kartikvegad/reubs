import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">Privacy</h1>
      <p className="mt-6 leading-8 text-muted">
        Enquiry forms and event bookings collect a name, phone, email and — for tickets — a student
        enrollment number. That information is used to reply to families and to issue QR passes. A
        full privacy notice will replace this page when the school’s legal text is ready.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Gate-scanner staff see ticket status at the door. Do not send documents through this website
        until a secure upload is provided.
      </p>
    </main>
  );
}
