import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyLinkButton from "@/components/copy-link-button";
import { tutorials } from "../data";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<TutorialPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = tutorials.find((t) => t.slug === slug);
  if (!tutorial) return { title: "Tutorial not found", robots: { index: false } };

  return {
    title: { absolute: `${tutorial.title} | ${SITE_NAME}` },
    description: tutorial.summary,
    alternates: { canonical: `/learn/${tutorial.slug}` },
    openGraph: {
      type: "article",
      title: tutorial.title,
      description: tutorial.summary,
      url: `/learn/${tutorial.slug}`,
    },
  };
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/ on\w+="[^"]*"/gi, "")
    .replace(/ on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

interface TutorialPageParams {
  slug: string;
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<TutorialPageParams>;
}) {
  const { slug } = await params;
  const tutorial = tutorials.find((t) => t.slug === slug);

  if (!tutorial) return notFound();

  return (
    <main className="min-h-screen bg-ink-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs text-ink-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-brand-600 transition-colors">
            Learn
          </Link>
          <span>/</span>
          <span className="text-ink-700 font-medium truncate">{tutorial.title}</span>
        </nav>

        <div className="bg-surface rounded-3xl shadow-lg border border-ink-100 overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              src={tutorial.video}
              title={tutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
              {tutorial.category}
            </span>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-tight">
                {tutorial.title}
              </h1>
              <CopyLinkButton path={`/learn/${tutorial.slug}`} className="bg-surface" />
            </div>
            <p className="text-ink-600 mb-8">{tutorial.summary}</p>

            <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tutorial.content) }} />

            <div className="mt-10 pt-6 border-t border-ink-100">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-700 transition"
              >
                ← Back to Learn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}