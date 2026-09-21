import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Student life" };

const stories = [
  [img.athletics, "Sports", "Matches, practice and sports day. Football, cricket, athletics, basketball and other games as the year’s calendar allows."],
  [img.stage, "Cultural activities", "House programmes, festivals and the long rehearsal weeks before Annual Day."],
  [img.music, "Music", "Listening, practice and performance, classroom music and stage work."],
  [img.dance, "Dance", "Movement, folk and contemporary forms as offered in a given year."],
  [img.art, "Art", "Drawing, colour, display and the slow looking that art demands."],
  [img.theatre, "Theatre", "Voice, cue and ensemble. A play teaches timing as surely as a timetable does."],
  [img.science, "Science activities", "Fairs, models, demonstrations and the pleasure of a result that was not copied from a chart."],
  [img.stem, "Technology", "Computers, simple making, and digital work that has a purpose."],
  [img.presentation, "Competitions", "Inter-house and, when scheduled, inter-school events. [Calendar: office.]"],
  [img.group, "Clubs", "Interest groups that meet when the year has room for them."],
  [img.celebration, "Celebrations", "National days, festivals and the small ceremonies that mark a school year."],
  [img.trip, "Field trips", "Journeys out of Maninagar when the academic plan includes them."],
  [img.workshop, "Workshops", "Visiting sessions, skill days and parent-facing programmes."],
  [img.assembly, "Leadership", "Councils, captains, anchoring and the unglamorous work of responsibility."],
  [img.community, "Community initiatives", "Campus care and neighbourhood gestures the school chooses to keep."],
];

const categories = [
  ["Sports", "Football, cricket, athletics, basketball and other sports as facilities and the calendar allow."],
  ["Arts & culture", "Art, music, dance, theatre and cultural programmes."],
  ["STEM & innovation", "Science projects, technology activities, coding, robotics and innovation-based learning, where the year’s plan includes them."],
  ["Clubs & communities", "Student clubs, interest groups and collaborative work. [Club list: to be published.]"],
  ["Leadership", "Student councils, competitions, presentations and duties that have a real audience."],
];

export default function LifePage() {
  return (
    <main>
      <section className="relative min-h-[50vh]">
        <Photo src={img.concert} alt="School performance" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-maroon-deep/65" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-paper">
          <Eyebrow>Life at Reubs</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl md:text-6xl">
            School is more than the next chapter
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gold-soft">
            A week at Reubs is supposed to include sweat, rehearsal, making and the odd public
            moment, not only homework. Activity names below are categories the office can keep exact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {stories.map(([src, title, copy]) => (
            <article key={title} className="mb-6 break-inside-avoid bg-paper">
              <Photo src={src} alt={title} className="aspect-[4/3]" />
              <div className="border border-t-0 border-gold-soft p-5">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl">Student activities</h2>
          <Note>Do not read this as a guaranteed list for the current session until the school confirms.</Note>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {categories.map(([title, copy]) => (
              <article key={title} className="border border-gold-soft p-6">
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </article>
            ))}
          </div>
          <Link href="/events" className="mt-10 inline-block text-maroon">
            See this year’s events
          </Link>
        </div>
      </section>
    </main>
  );
}
