import Link from "next/link";
import { Photo } from "@/components/site/Photo";

export function EventCard({
  href,
  image,
  category,
  title,
  summary,
  date,
  time,
  venue,
  audience,
  status,
  cta,
  featured = false,
}: {
  href?: string;
  image: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  venue: string;
  audience: string;
  status: string;
  cta?: string;
  featured?: boolean;
}) {
  const inner = (
    <>
      <Photo src={image} alt={title} className={featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"} sizes="(min-width: 1024px) 50vw, 100vw" />
      <div className="border border-t-0 border-gold-soft bg-paper p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.16em] text-maroon">{category}</p>
          <span className="rounded-full border border-gold-soft px-2 py-0.5 text-[11px] text-muted">{status}</span>
        </div>
        <h3 className={`mt-2 font-display ${featured ? "text-4xl" : "text-2xl"}`}>{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{summary}</p>
        <dl className="mt-4 grid gap-1 text-sm text-muted sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-maroon">Date</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-maroon">Time</dt>
            <dd>{time}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-maroon">Location</dt>
            <dd>{venue}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-maroon">Audience</dt>
            <dd>{audience}</dd>
          </div>
        </dl>
        {cta ? <p className="mt-4 text-sm text-maroon">{cta}</p> : null}
      </div>
    </>
  );

  if (!href) {
    return <article className="interactive-card bg-cream">{inner}</article>;
  }

  return (
    <Link href={href} className="interactive-card group block bg-cream">
      {inner}
    </Link>
  );
}
