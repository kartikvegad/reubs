import Link from "next/link";
import { FaqList } from "@/components/site/FaqList";
import { Eyebrow, Photo } from "@/components/site/Photo";
import { Reveal } from "@/components/site/Reveal";
import { eventAudience, registrationLabel } from "@/lib/eventMeta";
import { img } from "@/lib/media";
import { news } from "@/lib/news";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr, school } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

const pillars = [
  [img.classroom, "Academics", "A clear CBSE path from the early years to Class 12."],
  [img.teacher, "Character", "Respect and responsibility as everyday habits."],
  [img.art, "Creativity", "Art, music and stage work beside classroom learning."],
  [img.sports, "Wellbeing", "Ground time, games and healthy routines."],
];

const glance = [
  ["60+", "Years"],
  ["N–12", "Classes"],
  ["CBSE", "Board path"],
  ["East Ahmedabad", "Campus"],
];

const why = [
  [
    "Attentive classrooms",
    "Class groups stay manageable so teachers know each student and support steady progress.",
  ],
  [
    "Strong foundations",
    "Literacy, numeracy, science and languages are built carefully before board pressure rises.",
  ],
  [
    "Values in practice",
    "Courtesy, honesty and care for the campus form part of daily school culture.",
  ],
  [
    "A full school week",
    "Sports, arts, labs and stage work sit on the same calendar as academic assessment.",
  ],
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
      <section className="hero-stage relative -mt-16 overflow-hidden sm:-mt-[4.25rem]">
        <div className="absolute inset-0">
          <Photo
            src={img.hero}
            alt="Students walking together outdoors"
            className="hero-media absolute inset-0 h-full w-full"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/55 to-ink/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,163,90,0.18),transparent_45%)]" />
        </div>

        <div className="hero-copy relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 text-paper sm:px-5 sm:pb-16 sm:pt-32 md:pb-20">
          <p className="font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.88] tracking-[-0.04em] text-paper">
            {school.shortName}
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-[clamp(1.65rem,1.2rem+1.8vw,2.75rem)] font-medium italic leading-[1.15] text-gold-soft">
            Discipline, character and care, from Nursery to Class 12
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-gold-soft/90 sm:text-base sm:leading-7">
            A co-educational English-medium campus in Maninagar, Ahmedabad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admissions" className="btn-gold text-sm">
              Admissions
            </Link>
            <Link href="/about" className="btn-secondary text-sm text-paper">
              About the school
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad site-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <div className="photo-offset">
              <Photo
                src={img.intro}
                alt="Teacher with students in class"
                className="aspect-[4/5] max-h-[560px]"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.08]">
              A trusted campus in the heart of Maninagar
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              <p>
                Opposite Ramji Mandir on Punit Maharaj Road, Reubs serves families across east
                Ahmedabad with a calm, orderly English-medium school day.
              </p>
              <p>
                Academic rigour sits beside character formation, creative work and a campus that
                feels known — from the first classroom to Class 12.
              </p>
            </div>
            <Link href="/about" className="btn-primary mt-8 inline-flex text-sm">
              Discover Reubs
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-maroon-deep text-paper">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,163,90,0.16),transparent_40%)]" />
        <div className="section-pad relative mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <Eyebrow>
              <span className="text-gold">Profile</span>
            </Eyebrow>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.75rem)] text-gold">
              A school with a clear identity
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-8">
            {glance.map(([stat, label], index) => (
              <Reveal key={label} delay={index * 50}>
                <div className="stat-block">
                  <p className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none text-gold">
                    {stat}
                  </p>
                  <p className="mt-2 text-sm text-gold-soft">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <Eyebrow>Approach</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.85rem)]">
            What a Reubs education emphasises
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(([image, title, copy], index) => (
            <Reveal key={title} delay={index * 45}>
              <article className="pillar-card group">
                <Photo src={image} alt="" className="aspect-[5/4]" />
                <div className="pt-4">
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link href="/academics" className="text-link mt-10 inline-flex items-center gap-2 text-sm">
            View academics <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      <section className="section-pad bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Events</Eyebrow>
                <h2 className="mt-3 font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.75rem)]">
                  Upcoming programmes
                </h2>
              </div>
              <Link href="/events" className="text-link text-sm">
                All events →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => {
              const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
              const left = Math.max(0, Math.min(event.totalSeats, hallCapacity()) - sold);
              const upcoming = event.startsAt > new Date();
              const open = upcoming && left > 0;
              return (
                <Reveal key={event.id} delay={index * 55}>
                  <Link href={`/events/${event.slug}`} className="event-card group block h-full">
                    <Photo src={event.imageUrl} alt={event.title} className="aspect-[4/3]" />
                    <div className="pt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-maroon">
                        {event.category}
                      </p>
                      <h3 className="mt-2 font-display text-2xl leading-tight">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
                      </p>
                      <p className="text-sm text-muted">{eventAudience(event.category)}</p>
                      <p className="mt-3 text-sm font-medium text-maroon">
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

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:px-5 md:grid-cols-2 md:gap-4 md:py-8">
        <Reveal>
          <Link href="/campus" className="panel-link group">
            <Photo src={img.sports} alt="Sports on the school ground" className="absolute inset-0" />
            <div className="panel-link-shade" />
            <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-6 text-paper sm:min-h-[320px] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Campus</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Facilities & grounds</h2>
              <span className="mt-4 inline-flex text-sm text-gold transition-transform duration-300 group-hover:translate-x-1">
                Explore →
              </span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={70}>
          <Link href="/life" className="panel-link group">
            <Photo src={img.stage} alt="Students on stage" className="absolute inset-0" />
            <div className="panel-link-shade" />
            <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-6 text-paper sm:min-h-[320px] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Student life</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Beyond the classroom</h2>
              <span className="mt-4 inline-flex text-sm text-gold transition-transform duration-300 group-hover:translate-x-1">
                Explore →
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Notices</Eyebrow>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.75rem)]">
                From the school desk
              </h2>
            </div>
            <Link href="/news" className="text-link text-sm">
              All notices →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item, index) => (
            <Reveal key={item.slug} delay={index * 55}>
              <Link href={`/news/${item.slug}`} className="news-card group block h-full">
                <Photo src={item.image} alt={item.title} className="aspect-[16/10]" />
                <div className="pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-maroon">{item.category}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad site-surface-alt">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Reveal>
            <Eyebrow>Why Reubs</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.75rem)]">
              Why families stay with this campus
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px bg-gold-soft/70 sm:grid-cols-2">
            {why.map(([title, copy], index) => (
              <Reveal key={title} delay={index * 40}>
                <article className="why-cell h-full bg-cream p-6 sm:p-8">
                  <h3 className="font-display text-2xl sm:text-[1.7rem]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,1.35rem+1.8vw,2.75rem)]">
            Frequently asked
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-8">
            <FaqList />
          </div>
          <Link href="/contact" className="text-link mt-7 inline-block text-sm">
            Contact the school office →
          </Link>
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-maroon-deep px-4 py-14 text-paper sm:px-5 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.2),transparent_50%)]" />
        <Reveal>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Visit</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.08]">
                Come to the campus, or write to the office
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-gold-soft sm:text-base">
                Admissions begin with an enquiry. School programmes are listed on the Events calendar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admissions" className="btn-gold text-sm">
                Admission enquiry
              </Link>
              <Link href="/contact" className="btn-secondary text-sm text-paper">
                Contact
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
