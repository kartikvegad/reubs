import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";
import { school } from "@/lib/school";

export const metadata: Metadata = { title: "About" };

const why = [
  ["Student-focused learning", "Teachers work with class groups that are meant to stay knowable. The day is paced so a child is seen, not processed."],
  ["Strong academic foundations", "Literacy, numeracy, science and language are built carefully — especially in the years before board pressure arrives."],
  ["Values-based education", "Respect for elders, honesty in work, and care for the campus are taught as ordinary habits, not slogans."],
  ["Co-curricular breadth", "Ground, stage, studio and lab sit on the same calendar as tests. A Reubs week is supposed to have more than one kind of effort in it."],
  ["A modern learning environment", "Smart classrooms, laboratories and a library support the CBSE-oriented path. [Facility list to be kept current by the office.]"],
  ["Sports and creative development", "Physical education and the arts are not optional extras. They are how confidence and discipline become visible."],
  ["Confidence and communication", "Assemblies, presentations and house work give students practice in speaking clearly — in English, and in the languages of home."],
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative min-h-[52vh]">
        <Photo src={img.campus} alt="Campus exterior" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-maroon-deep/70" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-paper">
          <Eyebrow>Maninagar · Ahmedabad</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl md:text-6xl">About Reubs</h1>
          <p className="mt-4 max-w-2xl text-lg text-gold-soft">
            {school.name} — a co-educational English-medium campus with a CBSE-oriented academic path.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-20 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-8 text-muted">
          <h2 className="font-display text-4xl text-ink">Who we are</h2>
          <p>
            Reubs stands at Prabhu Park, 7/A, Punit Maharaj Road, opposite Ramji Mandir, Balvatika,
            Maninagar. The campus is compact by design: classrooms, labs, a library, an auditorium,
            a ground, and the rooms where music and art happen. Families come from the lanes around
            the mandir and from further across east Ahmedabad.
          </p>
          <p>
            The educational approach is sequential. Early years begin in a Montessori-influenced
            environment. Primary, middle, secondary and higher secondary follow without a change of
            school culture. Children are not asked to reinvent themselves every few years; they are
            asked to grow inside a place that already knows their name.
          </p>
          <p>
            Academic development is the spine: reading, writing, number, science, social science and
            languages, taught with enough patience for concepts to settle. Character development is
            the posture of the day — how students enter a room, how they treat a younger child, how
            they finish work they would rather postpone.
          </p>
          <p>
            Creativity is given time: drawing, making, music, theatre. Discipline is expected without
            theatre of its own. Confidence is practised in assembly and on stage. Communication is
            English-medium instruction plus Gujarati as a living language of the city. Leadership is
            small and real — a house duty, a science stall, a welcome at the gate on Annual Day.
          </p>
          <p>
            Technology and future readiness mean computer work, labs, and the habit of asking what a
            fact is for. Co-curricular life is not a brochure list; it is the second half of a
            serious education. The campus is meant to feel safe and encouraging — known adults,
            known routes, a medical room, and eyes on the ground at dispersal.
          </p>
        </div>
        <div className="space-y-4">
          <Photo src={img.students} alt="Students on campus" className="aspect-[4/3]" />
          <Photo src={img.chalkboard} alt="Classroom board" className="aspect-[4/3]" />
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Photo src={img.portrait} alt="Principal portrait placeholder" className="aspect-[3/4] max-w-sm" />
          <div>
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="mt-3 font-display text-4xl">Message from the Principal</h2>
            <p className="mt-2 text-sm text-muted">[Principal&apos;s name — to be confirmed by the school]</p>
            <div className="mt-6 space-y-4 leading-8 text-muted">
              <p>
                A school is a promise made every morning. At Reubs we promise a day in which a child
                is taught well, spoken to with respect, and asked to try things that are slightly
                harder than yesterday. Education here is not a race through chapters. It is the slow
                work of building a mind that can read, reason and revise — and a character that can
                wait, share and tell the truth.
              </p>
              <p>
                Parents are not visitors at the gate. They are partners in a long apprenticeship.
                Together we look after values, responsibility and confidence. Together we prepare
                students for a world that will keep changing: board examinations, further study, work,
                and the ordinary courage of adult life in Ahmedabad.
              </p>
              <p>
                Lifelong learning begins when a student discovers that effort is not punishment. If
                we get the years at Reubs right, that discovery lasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Eyebrow>Why Reubs</Eyebrow>
        <h2 className="mt-3 font-display text-4xl">Why families stay with this campus</h2>
        <p className="mt-3 max-w-2xl text-muted">
          These are statements of intent, not rankings. We do not claim to be the first or the best
          school in Ahmedabad.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {why.map(([title, copy]) => (
            <article key={title} className="border border-gold-soft bg-paper p-6">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 leading-7 text-muted">{copy}</p>
            </article>
          ))}
        </div>
        <Note>Replace any line the office wishes to phrase differently.</Note>
        <Link href="/admissions" className="mt-8 inline-block rounded-full bg-maroon px-5 py-3 text-paper">
          Enquire about admission
        </Link>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Families</Eyebrow>
          <h2 className="mt-3 font-display text-4xl">Parent testimonials</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Placeholder quotes until families agree to be named. Do not treat these as published reviews.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <blockquote key={n} className="border border-gold-soft bg-cream p-6">
                <p className="font-display text-2xl leading-8">[Parent testimonial will appear here.]</p>
                <footer className="mt-6 text-sm text-muted">
                  <p>[Parent name]</p>
                  <p>[Student grade] · Parent / Guardian</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
