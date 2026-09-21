import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";
import { school } from "@/lib/school";

export const metadata: Metadata = { title: "About" };

const why = [
  [
    "Student-focused learning",
    "Class groups are kept manageable so teachers can know each student and support steady academic progress.",
  ],
  [
    "Strong academic foundations",
    "Literacy, numeracy, science and languages are built carefully before board-level demands begin.",
  ],
  [
    "Values-based education",
    "Respect, honesty and care for the campus are taught as everyday habits.",
  ],
  [
    "Co-curricular breadth",
    "Sports, arts, laboratories and stage work form part of the same school calendar as academic assessment.",
  ],
  [
    "Modern learning environment",
    "Smart classrooms, laboratories and a library support the CBSE-oriented academic path.",
  ],
  [
    "Sports and creative development",
    "Physical education and the arts help students build discipline, confidence and teamwork.",
  ],
  [
    "Communication and confidence",
    "Assemblies, presentations and house activities give students regular practice in clear public speaking.",
  ],
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
            {school.name}: a co-educational English-medium campus with a CBSE-oriented academic path.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-20 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-8 text-muted">
          <h2 className="font-display text-4xl text-ink">Who we are</h2>
          <p>
            Reubs stands at Prabhu Park, 7/A, Punit Maharaj Road, opposite Ramji Mandir, Balvatika,
            Maninagar. The campus brings together classrooms, laboratories, a library, an auditorium,
            sports grounds and spaces for music and art.
          </p>
          <p>
            Learning progresses in a clear sequence: early years, primary, middle, secondary and
            higher secondary, within one consistent school culture. Students grow in a setting that
            values continuity, familiarity and steady academic expectations.
          </p>
          <p>
            Academic development remains central: reading, writing, mathematics, science, social
            science and languages, taught with care so concepts take root. Character education is
            equally important: how students enter a room, treat younger peers and complete work with
            honesty.
          </p>
          <p>
            Creativity, disciplined routines and confident communication are cultivated through art,
            music, theatre, assemblies and house responsibilities. Instruction is English-medium,
            with Gujarati as a living language of the city.
          </p>
          <p>
            Technology, laboratory work and co-curricular programmes prepare students for further
            study and responsible adult life. The campus is intended to feel safe, orderly and
            encouraging, with known adults, clear routines and attentive supervision.
          </p>
        </div>
        <div className="space-y-4">
          <Photo src={img.students} alt="Students on campus" className="aspect-[4/3]" />
          <Photo src={img.chalkboard} alt="Classroom board" className="aspect-[4/3]" />
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Photo src={img.portrait} alt="Principal" className="aspect-[3/4] max-w-sm" />
          <div>
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="mt-3 font-display text-4xl">Message from the Principal</h2>
            <p className="mt-2 text-sm text-muted">Office of the Principal</p>
            <div className="mt-6 space-y-4 leading-8 text-muted">
              <p>
                At Reubs, our commitment is to teach each child well, treat every student with
                respect, and expect steady effort. Education here is not a rush through chapters; it
                is the careful work of building minds that can read, reason and revise, and characters
                that can wait, share and act with integrity.
              </p>
              <p>
                Parents are partners in this long apprenticeship. Together we nurture values,
                responsibility and confidence, and prepare students for board examinations, further
                study and the demands of adult life.
              </p>
              <p>
                Lifelong learning begins when a student discovers that effort is worthwhile. Our aim
                is that this discovery takes root during the years spent at Reubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Eyebrow>Why Reubs</Eyebrow>
        <h2 className="mt-3 font-display text-4xl">Why families choose this campus</h2>
        <p className="mt-3 max-w-2xl text-muted">
          These principles guide daily school life across academics, character and co-curricular work.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {why.map(([title, copy]) => (
            <article key={title} className="border border-gold-soft bg-paper p-6">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 leading-7 text-muted">{copy}</p>
            </article>
          ))}
        </div>
        <Link href="/admissions" className="mt-8 inline-block rounded-full bg-maroon px-5 py-3 text-paper">
          Enquire about admission
        </Link>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Families</Eyebrow>
          <h2 className="mt-3 font-display text-4xl">What parents value</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Feedback shared by families whose children study at Reubs.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [
                "Teachers know our child by name and follow progress with care. The campus feels orderly and welcoming.",
                "Parent of Class 4 student",
              ],
              [
                "Academics are taken seriously, yet there is proper time for sports and stage work. That balance matters to us.",
                "Parent of Class 8 student",
              ],
              [
                "Communication from the office is clear, and school events are well organised for families.",
                "Parent of Class 11 student",
              ],
            ].map(([quote, byline]) => (
              <blockquote key={byline} className="border border-gold-soft bg-cream p-6">
                <p className="font-display text-2xl leading-8">&ldquo;{quote}&rdquo;</p>
                <footer className="mt-6 text-sm text-muted">
                  <p>{byline}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
