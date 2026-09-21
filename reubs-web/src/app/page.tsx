import Link from "next/link";
import { FaqList } from "@/components/site/FaqList";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { Reveal } from "@/components/site/Reveal";
import { eventAudience, registrationLabel } from "@/lib/eventMeta";
import { img } from "@/lib/media";
import { news } from "@/lib/news";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr, school } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

const pillars = [
  [img.classroom, "Academic excellence", "Strong foundations from the early years through Classes 11 and 12."],
  [img.teacher, "Character & values", "Respect, responsibility and a quiet confidence in how students work together."],
  [img.art, "Creativity & innovation", "Art, music and making taught as part of the day, not only as an extra."],
  [img.sports, "Sports & wellbeing", "Ground time, games and habits of health beside classroom work."],
];

const glance = [
  ["XX+", "Years"],
  ["XX+", "Students"],
  ["Nursery to 12", "Programmes"],
  ["Year-round", "Events"],
];

const why = [
  ["Student-focused learning", "Class groups that stay knowable, and a day paced so a child is seen."],
  ["Strong academic foundations", "Literacy, numeracy, science and language built carefully before board pressure arrives."],
  ["Values-based education", "Respect, honesty and care for the campus as ordinary habits."],
  ["Co-curricular breadth", "Ground, stage, studio and lab on the same calendar as tests."],
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            src={img.hero}
            alt="Students walking together outdoors"
            className="absolute inset-0 h-full w-full"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/92 via-maroon-deep/50 to-ink/20" />
        </div>

        <div className="hero-copy relative mx-auto flex min-h-[min(68svh,560px)] max-w-6xl flex-col justify-end px-4 py-10 text-paper sm:min-h-[min(72svh,640px)] sm:px-5 sm:py-14 md:min-h-[min(78svh,720px)] md:py-16">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold sm:text-xs">
            {school.shortName} · Maninagar
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2rem,1.4rem+3.2vw,3.75rem)] leading-[1.08]">
            Education, character and becoming ready
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-gold-soft sm:text-base sm:leading-7">
            A CBSE-oriented English-medium campus in Ahmedabad, from the early years to Class 12.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/about" className="btn-gold text-sm">
              Explore the school
            </Link>
            <Link href="/events" className="btn-secondary text-sm">
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-5 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <Photo src={img.intro} alt="Teacher with students in class" className="aspect-[4/5] max-h-[520px]" />
        </Reveal>
        <Reveal delay={60}>
          <Eyebrow>About Reubs</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)]">
            A Maninagar school with a long memory
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            <p>
              Reubs sits opposite Ramji Mandir on Punit Maharaj Road. It is co-educational and
              English-medium, with a CBSE-oriented path from the first classroom to Class 12.
            </p>
            <p>
              Academic development sits beside character, creativity and confidence. Classrooms are
              meant to feel safe, and co-curricular life is treated as part of education.
            </p>
          </div>
          <Link href="/about" className="btn-primary mt-7 inline-flex text-sm">
            Discover Reubs
          </Link>
        </Reveal>
      </section>

      <section className="section-pad bg-maroon-deep text-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <Eyebrow>At a glance</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] text-gold">
              Figures the office will keep current
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {glance.map(([stat, label], index) => (
              <Reveal key={label} delay={index * 40}>
                <article className="interactive-card border border-white/15 p-4 sm:p-5">
                  <p className="font-display text-2xl text-gold sm:text-3xl">{stat}</p>
                  <p className="mt-1 text-sm text-gold-soft">{label}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <Eyebrow>Philosophy</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)]">
            How a Reubs education holds together
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(([image, title, copy], index) => (
            <Reveal key={title} delay={index * 40}>
              <article className="interactive-card group h-full overflow-hidden border border-gold-soft bg-paper">
                <Photo src={image} alt="" className="aspect-[16/10]" />
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-xl sm:text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link href="/academics" className="text-link mt-8 inline-block text-sm">
            Explore academics
          </Link>
        </Reveal>
      </section>

      <section className="section-pad bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Eyebrow>Events</Eyebrow>
                <h2 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)]">
                  The campus calendar
                </h2>
              </div>
              <Link href="/events" className="text-link text-sm">
                View all
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => {
              const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
              const left = Math.max(0, Math.min(event.totalSeats, hallCapacity()) - sold);
              const upcoming = event.startsAt > new Date();
              const open = upcoming && left > 0;
              return (
                <Reveal key={event.id} delay={index * 50}>
                  <Link href={`/events/${event.slug}`} className="interactive-card group block h-full bg-cream">
                    <Photo src={event.imageUrl} alt={event.title} className="aspect-[4/3]" />
                    <div className="p-4 sm:p-5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">{event.category}</p>
                      <h3 className="mt-2 font-display text-xl sm:text-2xl">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
                      </p>
                      <p className="text-sm text-muted">{eventAudience(event.category)}</p>
                      <p className="mt-3 text-sm">
                        {formatInr(event.priceInPaise)} · {registrationLabel(open, upcoming, left)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto grid max-w-6xl gap-4 px-4 sm:px-5 md:grid-cols-2">
        <Reveal>
          <Link href="/campus" className="group relative block min-h-[240px] overflow-hidden sm:min-h-[300px]">
            <Photo src={img.sports} alt="Sports on the school ground" className="absolute inset-0" />
            <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/35" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Campus</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl">Labs, ground and stage</h2>
              <span className="mt-3 inline-block text-sm text-gold">Walk the facilities</span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={60}>
          <Link href="/life" className="group relative block min-h-[240px] overflow-hidden sm:min-h-[300px]">
            <Photo src={img.stage} alt="Students on stage" className="absolute inset-0" />
            <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/35" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Student life</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl">More than the timetable</h2>
              <span className="mt-3 inline-block text-sm text-gold">Life at Reubs</span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>News</Eyebrow>
              <h2 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)]">
                From the school desk
              </h2>
              <Note>Sample announcements for layout.</Note>
            </div>
            <Link href="/news" className="text-link text-sm">
              All news
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item, index) => (
            <Reveal key={item.slug} delay={index * 50}>
              <Link href={`/news/${item.slug}`} className="interactive-card group block h-full bg-paper">
                <Photo src={item.image} alt={item.title} className="aspect-[16/10]" />
                <div className="border border-t-0 border-gold-soft p-4 sm:p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">{item.category}</p>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <Eyebrow>Why Reubs</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)]">
              Why families choose this campus
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {why.map(([title, copy], index) => (
              <Reveal key={title} delay={index * 40}>
                <article className="interactive-card h-full border border-gold-soft p-5">
                  <h3 className="font-display text-xl sm:text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)]">
            Frequently asked
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-8">
            <FaqList />
          </div>
          <Link href="/contact" className="text-link mt-6 inline-block text-sm">
            Contact the office
          </Link>
        </Reveal>
      </section>

      <section className="bg-cream px-4 py-10 sm:px-5 sm:py-14">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col gap-5 border border-gold-soft bg-paper px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,1.25rem+1.4vw,2.25rem)]">
                Visit the campus, or write to the office
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
                Admissions begin with an enquiry. Event booking is open to current students.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admissions" className="btn-primary text-sm">
                Admission enquiry
              </Link>
              <Link href="/contact" className="btn-outline text-sm">
                Contact
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
