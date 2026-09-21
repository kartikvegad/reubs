import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { news } from "@/lib/news";

export const metadata: Metadata = { title: "News & updates" };

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Bulletin</Eyebrow>
      <h1 className="mt-3 font-display text-5xl">News & updates</h1>
      <p className="mt-4 max-w-2xl leading-8 text-muted">
        Sample cards showing how announcements, academic notes and event news will appear. The
        office should replace headlines and dates with current information.
      </p>
      <Note>Demo content for layout — not an official notice board until the school takes it over.</Note>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Link key={item.slug} href={`/news/${item.slug}`} className="bg-paper">
            <Photo src={item.image} alt={item.title} className="aspect-[16/10]" />
            <div className="border border-t-0 border-gold-soft p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-maroon">{item.category}</p>
              <p className="mt-1 text-sm text-muted">{item.date}</p>
              <h2 className="mt-2 font-display text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
              <p className="mt-3 text-sm text-maroon">Read more</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
