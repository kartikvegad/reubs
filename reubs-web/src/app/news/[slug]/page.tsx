import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/site/Photo";
import { news } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((entry) => entry.slug === slug);
  return { title: item?.title || "News" };
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const item = news.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-maroon">{item.category}</p>
      <p className="mt-2 text-sm text-muted">{item.date}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{item.title}</h1>
      <Photo src={item.image} alt={item.title} className="mt-8 aspect-[16/9]" sizes="768px" />
      <p className="mt-8 text-lg leading-8 text-muted">{item.body}</p>
      <Link href="/news" className="mt-10 inline-block text-maroon">
        All news
      </Link>
    </main>
  );
}
