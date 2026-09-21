import type { Metadata } from "next";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Achievements" };

const areas = [
  [img.library, "Academic achievements", "Board results, subject distinctions and classroom milestones, to be listed when the school releases them."],
  [img.sports, "Sports achievements", "House meets, athletics and team results. [Season record: office.]"],
  [img.stage, "Cultural achievements", "Music, dance, theatre and festival work. [Awards: to be confirmed.]"],
  [img.science, "Science & innovation", "Fairs, models and technology projects presented by students."],
  [img.presentation, "Competitions", "Inter-house and external events as entered in a given year."],
  [img.students, "Student awards", "Certificates and recognitions the school chooses to publish."],
  [img.teacher, "Faculty recognition", "Teaching awards and long service, [to be confirmed]."],
  [img.campus, "School achievements", "Campus milestones and community work, without invented rankings."],
];

export default function AchievementsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Eyebrow>Recognition</Eyebrow>
        <h1 className="mt-3 font-display text-5xl">Achievements</h1>
        <p className="mt-4 max-w-2xl leading-8 text-muted">
          This page is a frame for verified news. We do not invent awards, ranks or “No. 1”
          claims. When the office shares results, they belong in the cards below.
        </p>
        <Note>All achievement lines are placeholders until the school confirms them.</Note>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["XX+", "Academic mentions this year"],
            ["XX+", "Sports & cultural entries"],
            ["XX+", "Student recognitions"],
          ].map(([n, l]) => (
            <div key={l} className="border border-gold-soft bg-paper p-6">
              <p className="font-display text-4xl text-maroon">{n}</p>
              <p className="mt-2 text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {areas.map(([src, title, copy]) => (
            <article key={title} className="flex gap-4 bg-paper">
              <Photo src={src} alt={title} className="h-36 w-36 shrink-0" />
              <div className="py-4 pr-4">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
