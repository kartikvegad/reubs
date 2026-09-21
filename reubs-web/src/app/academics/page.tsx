import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Academics" };

const stages = [
  {
    name: "Primary school",
    range: "Foundational years",
    image: img.primary,
    copy: "Literacy, numeracy, oracy and the first social habits of a classroom. Curiosity is protected. Children learn to sit with a task, share materials, and find pleasure in reading. Creativity is daily (drawing, song, making), not a Friday treat. Social development is watched as carefully as handwriting.",
  },
  {
    name: "Middle school",
    range: "Conceptual years",
    image: img.classroom2,
    copy: "Subjects widen. Students meet more demanding texts, experiments and maps. Analytical thinking is practised in small steps: observe, compare, explain. Collaboration becomes ordinary: lab pairs, group work, presentations. The aim is conceptual learning, not only coverage.",
  },
  {
    name: "Secondary school",
    range: "Classes towards the boards",
    image: img.workshop,
    copy: "Deeper subject understanding, a more deliberate academic discipline, and honest conversation about examinations. Career awareness begins as curiosity, not pressure. Students are asked to manage time, keep notebooks that can be revised from, and speak for their own work.",
  },
  {
    name: "Higher secondary",
    range: "Classes 11–12",
    image: img.library,
    copy: "Subject specialisation, academic guidance, career planning and awareness of competitive examinations. Mentorship is personal: a student should leave these years knowing how they work, not only what they scored. Personal development (stamina, judgement, courtesy) remains part of the brief.",
  },
];

const cbse = [
  ["Structured curriculum", "A planned sequence of concepts, skills and revision, so a year has shape, not only a textbook list."],
  ["Concept-based learning", "Students are asked to explain, apply and connect, not only to recall a definition for a test."],
  ["Continuous development", "Progress is watched across the year through classwork, practicals and periodic assessment."],
  ["Academic assessment", "Tests and assignments are used to teach as well as to measure. [Assessment policy: office to publish.]"],
  ["Experiential learning", "Labs, projects, field work and performances sit beside classroom instruction."],
  ["Skill development", "Communication, collaboration, digital work and study habits are treated as skills to be taught."],
  ["Critical thinking", "Questions are welcomed. A good answer includes the reason it is good."],
  ["Application-based learning", "Wherever possible, a concept is asked to do some work in a real task."],
];

export default function AcademicsPage() {
  return (
    <main>
      <section className="relative min-h-[46vh]">
        <Photo src={img.reading} alt="Students reading" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-paper">
          <Eyebrow>Academics</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl md:text-6xl">
            A CBSE-oriented path from the first classroom to Class 12
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-5 py-20">
        {stages.map((stage, index) => (
          <article key={stage.name} className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Photo src={stage.image} alt={stage.name} className="aspect-[4/3]" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-maroon">{stage.range}</p>
              <h2 className="mt-2 font-display text-4xl">{stage.name}</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{stage.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>CBSE education</Eyebrow>
          <h2 className="mt-3 font-display text-4xl">How the curriculum is meant to work</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted">
            Reubs follows a CBSE-oriented academic organisation: structured years, concept-based
            teaching, and a balance of assessment and experience. We do not publish affiliation
            numbers or dates on this page until the school confirms them.
          </p>
          <Note>CBSE affiliation number / year: to be confirmed</Note>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {cbse.map(([title, copy]) => (
              <article key={title} className="border border-gold-soft p-6">
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/campus" className="rounded-full bg-maroon px-5 py-3 text-paper">
              See campus facilities
            </Link>
            <Link href="/admissions" className="rounded-full border border-maroon px-5 py-3 text-maroon">
              Speak with the office
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
