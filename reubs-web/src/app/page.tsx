import Link from "next/link";
import { FaqList } from "@/components/site/FaqList";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { eventAudience, registrationLabel } from "@/lib/eventMeta";
import { img } from "@/lib/media";
import { news } from "@/lib/news";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr, school } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

const pillars = [
  [img.classroom, "Academic excellence", "Strong foundations, curiosity and independent thinking — from literacy in the early years to specialised work in Classes 11 and 12."],
  [img.teacher, "Character & values", "Respect, responsibility and a quiet kind of confidence that shows in how students speak, work and look after one another."],
  [img.art, "Creativity & innovation", "Art, music, making and experiment. Students are asked to try, revise and present — not only to recall."],
  [img.sports, "Sports & wellbeing", "Ground time, games and habits of health. Teamwork and discipline are taught on the field as much as in class."],
  [img.presentation, "Leadership & confidence", "Assemblies, houses, presentations and the chance to take a small responsibility and finish it well."],
  [img.computer, "Future readiness", "Technology, critical thinking and practical learning so students can meet a world that will not stay still."],
];

const glance = [
  ["XX+", "Years of educational excellence", "To be confirmed by the school"],
  ["XX+", "Students", "Placeholder until the office publishes a roll"],
  ["XX+", "Faculty members", "Placeholder"],
  ["Nursery–12", "Academic programmes", "English-medium, CBSE-oriented path"],
  ["XX+", "Campus facilities", "Labs, library, ground, auditorium"],
  ["Year-round", "Activities & events", "Sports, culture, science, community"],
];

const why = [
  ["Student-focused learning", "Class groups that stay knowable, and a day paced so a child is seen."],
  ["Strong academic foundations", "Literacy, numeracy, science and language built carefully before board pressure arrives."],
  ["Values-based education", "Respect, honesty and care for the campus as ordinary habits."],
  ["Co-curricular breadth", "Ground, stage, studio and lab on the same calendar as tests."],
  ["Modern learning rooms", "Smart classrooms, laboratories and a library on a compact campus."],
  ["Sports and creative work", "Physical education and the arts as part of how confidence becomes visible."],
  ["Confidence and communication", "Assemblies and presentations — in English, and in the languages of home."],
];

const stories = [
  [img.hero, "A Day at Reubs", "From assembly to the last period — the ordinary shape of a school day."],
  [img.sports, "Life Beyond the Classroom", "Ground, stage and studio as the second half of a serious education."],
  [img.science, "Learning Through Experience", "Labs, projects and making, not only chapters."],
  [img.stage, "Celebrating Student Achievements", "The public moments: Annual Day, sports meet, exhibitions."],
];

const testimonials = [
  {
    quote: "[Parent testimonial will appear here.]",
    name: "[Parent name]",
    grade: "[Student grade]",
    role: "Parent / Guardian",
  },
  {
    quote: "[Parent testimonial will appear here.]",
    name: "[Parent name]",
    grade: "[Student grade]",
    role: "Parent / Guardian",
  },
  {
    quote: "[Parent testimonial will appear here.]",
    name: "[Parent name]",
    grade: "[Student grade]",
    role: "Parent / Guardian",
  },
];

export default async function HomePage() {
  const events = await prisma.event.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 3,
    include: { tickets: { where: { status: { not: "cancelled" } }, select: { quantity: true } } },
  });

  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Photo src={img.hero} alt="Students learning together in a Reubs classroom" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/80 via-maroon-deep/45 to-ink/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 text-paper">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">
            Reubs Primary & Higher Secondary School · Ahmedabad, Gujarat
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-gold-soft">
            Maninagar · CBSE-oriented · English medium · Co-educational
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            A school where education, character and future readiness grow together
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gold-soft">
            {school.name} is a neighbourhood campus at Prabhu Park, Maninagar. Children move from
            early years to higher secondary without leaving the culture they already know — serious
            about learning, warm with families, and particular about how a school day should feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="rounded-full bg-gold px-6 py-3 text-ink">
              Explore the school
            </Link>
            <Link href="/events" className="rounded-full border border-gold-soft px-6 py-3">
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <Photo src={img.intro} alt="Teacher with students in class" className="aspect-[4/5]" />
        <div>
          <Eyebrow>About Reubs</Eyebrow>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A Maninagar school with a long memory</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
            <p>
              Reubs sits opposite Ramji Mandir on Punit Maharaj Road — a walk many families in
              Balvatika have made for decades. It is co-educational and English-medium, with a
              CBSE-oriented academic path from the first classroom to Class 12.
            </p>
            <p>
              The work of the school is not only marks. Academic development sits beside character,
              creativity, discipline, confidence, communication and leadership. Technology and
              practical learning are part of how we prepare students for what comes next — board
              years, further study, and a public life in Gujarat and beyond.
            </p>
            <p>
              Classrooms are meant to feel encouraging and safe. Teachers stay with children long
              enough to know them. Co-curricular life — ground, stage, lab and studio — is treated as
              part of education, not an extra hour at the end of the timetable.
            </p>
          </div>
          <Link href="/about" className="mt-8 inline-block rounded-full bg-maroon px-5 py-3 text-paper">
            Discover Reubs
          </Link>
        </div>
      </section>

      <section className="bg-maroon-deep py-16 text-paper">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>School at a glance</Eyebrow>
          <h2 className="mt-3 font-display text-4xl text-gold">Figures the office will keep current</h2>
          <p className="mt-3 max-w-2xl text-gold-soft">
            Until the school publishes verified counts, these remain editable placeholders. Do not
            read them as official statistics.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {glance.map(([stat, label, note]) => (
              <article key={label} className="border border-white/15 p-6">
                <p className="font-display text-4xl text-gold">{stat}</p>
                <p className="mt-2">{label}</p>
                <p className="mt-2 text-xs text-gold-soft">[{note}]</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Eyebrow>Educational philosophy</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-4xl md:text-5xl">
          Six ways a Reubs education holds together
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map(([image, title, copy]) => (
            <article key={title} className="overflow-hidden border border-gold-soft bg-paper">
              <Photo src={image} alt="" className="aspect-[16/9]" />
              <div className="p-6">
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/academics" className="mt-10 inline-block text-maroon">
          Explore academics
        </Link>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Events</Eyebrow>
              <h2 className="mt-3 font-display text-4xl">The campus calendar</h2>
              <p className="mt-3 max-w-xl text-muted">
                Families book verified student passes, choose seats, and receive a QR e-ticket. Demo
                programmes below can be replaced by the office.
              </p>
            </div>
            <Link href="/events" className="text-sm text-maroon">
              View all events
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map((event) => {
              const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
              const left = Math.max(0, Math.min(event.totalSeats, hallCapacity()) - sold);
              const upcoming = event.startsAt > new Date();
              const open = upcoming && left > 0;
              return (
                <Link key={event.id} href={`/events/${event.slug}`} className="group bg-cream">
                  <Photo src={event.imageUrl} alt={event.title} className="aspect-[4/3]" />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-maroon">{event.category}</p>
                    <h3 className="mt-2 font-display text-2xl">{event.title}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
                    </p>
                    <p className="text-sm text-muted">{event.venue}</p>
                    <p className="mt-2 text-sm text-muted">{eventAudience(event.category)}</p>
                    <p className="mt-3 text-sm">
                      {formatInr(event.priceInPaise)} · {registrationLabel(open, upcoming, left)}
                    </p>
                    <p className="mt-2 text-sm text-maroon">{open ? "Register / Get pass" : "View details"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-2">
        <div className="relative min-h-[360px]">
          <Photo src={img.sports} alt="Sports on the school ground" className="absolute inset-0" />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute bottom-0 p-8 text-paper">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Campus</p>
            <h2 className="mt-2 font-display text-4xl">Labs, ground, stage and quiet rooms</h2>
            <Link href="/campus" className="mt-4 inline-block text-gold">
              Walk the facilities
            </Link>
          </div>
        </div>
        <div className="relative min-h-[360px]">
          <Photo src={img.stage} alt="Students on stage" className="absolute inset-0" />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute bottom-0 p-8 text-paper">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Student life</p>
            <h2 className="mt-2 font-display text-4xl">More than the timetable</h2>
            <Link href="/life" className="mt-4 inline-block text-gold">
              Life at Reubs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-maroon-deep py-20 text-paper">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>School stories</Eyebrow>
          <h2 className="mt-3 font-display text-4xl text-gold">See the campus in motion</h2>
          <p className="mt-3 max-w-2xl text-gold-soft">
            Polished placeholders until the school connects YouTube or uploaded films. Each tile is
            ready for a video URL.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {stories.map(([image, title, copy]) => (
              <article key={title} className="relative min-h-[280px]">
                <Photo src={image} alt={title} className="absolute inset-0" />
                <div className="absolute inset-0 bg-ink/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-gold text-2xl text-gold" aria-hidden>
                    ▶
                  </span>
                  <h3 className="mt-5 font-display text-3xl">{title}</h3>
                  <p className="mt-2 max-w-md text-sm text-gold-soft">{copy}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gold">[Video to be added]</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>News & updates</Eyebrow>
            <h2 className="mt-3 font-display text-4xl">From the school desk</h2>
            <Note>Sample announcements — replace with current circulars.</Note>
          </div>
          <Link href="/news" className="text-sm text-maroon">
            All news
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {news.slice(0, 3).map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="bg-paper">
              <Photo src={item.image} alt={item.title} className="aspect-[16/10]" />
              <div className="border border-t-0 border-gold-soft p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-maroon">{item.category}</p>
                <p className="mt-1 text-sm text-muted">{item.date}</p>
                <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
                <p className="mt-3 text-sm text-maroon">Read more</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Why Reubs</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl">Why families choose this campus</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Statements of intent, not rankings. We do not claim to be the first or the best school in
            Ahmedabad.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {why.map(([title, copy]) => (
              <article key={title} className="border border-gold-soft p-6">
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </article>
            ))}
          </div>
          <Link href="/about" className="mt-8 inline-block text-maroon">
            Read the principal’s message
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Eyebrow>Families</Eyebrow>
        <h2 className="mt-3 font-display text-4xl">Parent voices</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Layout for genuine reviews. Names and grades stay editable until families agree to be quoted.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <blockquote key={index} className="border border-gold-soft bg-paper p-6">
              <p className="font-display text-2xl leading-8 text-maroon-deep">{item.quote}</p>
              <footer className="mt-6 text-sm text-muted">
                <p>{item.name}</p>
                <p>{item.grade} · {item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-3 font-display text-4xl">Frequently asked</h2>
          <div className="mt-8">
            <FaqList />
          </div>
          <Link href="/contact" className="mt-8 inline-block text-maroon">
            Still have a question? Contact the office
          </Link>
        </div>
      </section>

      <section className="bg-cream px-5 py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 border border-gold-soft bg-paper px-8 py-10">
          <div>
            <h2 className="font-display text-4xl">Visit the campus, or write to the office</h2>
            <p className="mt-3 max-w-xl text-muted">
              Admissions begin with an enquiry. Event booking is open to current students with a
              valid enrollment number.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admissions" className="rounded-full bg-maroon px-5 py-3 text-paper">
              Admission enquiry
            </Link>
            <Link href="/contact" className="rounded-full border border-maroon px-5 py-3 text-maroon">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
