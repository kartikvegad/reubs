import type { Metadata } from "next";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Faculty" };

const people = [
  ["[Name]", "Principal", "Leadership", "A short introduction will appear here once the school provides a biography."],
  ["[Name]", "Academic coordinator", "Academics", "Placeholder profile for the office to complete."],
  ["[Name]", "Primary coordinator", "Primary", "Placeholder profile for the office to complete."],
  ["[Name]", "Secondary coordinator", "Secondary", "Placeholder profile for the office to complete."],
  ["[Name]", "Faculty member", "Languages", "Placeholder profile for the office to complete."],
  ["[Name]", "Faculty member", "Mathematics", "Placeholder profile for the office to complete."],
  ["[Name]", "Faculty member", "Sciences", "Placeholder profile for the office to complete."],
  ["[Name]", "Faculty member", "Physical education", "Placeholder profile for the office to complete."],
];

const portraits = [img.portrait, img.teacher, img.workshop, img.students, img.reading, img.writing, img.lab, img.wellbeing];

export default function FacultyPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>People</Eyebrow>
      <h1 className="mt-3 font-display text-5xl">Faculty</h1>
      <p className="mt-4 max-w-2xl leading-8 text-muted">
        Reubs is staffed by teachers who work across primary, secondary and higher secondary. Named
        profiles and photographs will replace the cards below when the school supplies them.
      </p>
      <Note>All names, designations and portraits are layout placeholders.</Note>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {people.map(([name, role, dept, intro], index) => (
          <article key={`${role}-${index}`} className="bg-paper">
            <Photo src={portraits[index]} alt="Faculty portrait placeholder" className="aspect-[3/4]" />
            <div className="border border-t-0 border-gold-soft p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-maroon">{dept}</p>
              <h2 className="mt-1 font-display text-2xl">{name}</h2>
              <p className="text-sm">{role}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{intro}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
