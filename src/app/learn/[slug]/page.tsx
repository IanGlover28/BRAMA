import { notFound } from "next/navigation";
import Image from "next/image";
import { articles } from "../data";

interface ArticlePageParams {
  slug: string;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<ArticlePageParams>;
}) {

  const { slug } = await params;

  const article = articles.find((a) => a.slug === slug);

  if (!article) return notFound();

  return (
    <article className="max-w-3xl mx-auto py-16 px-6">
      <Image
        src={article.image}
        alt={article.title}
        width={900}
        height={400}
        className="w-full h-64 object-cover rounded-xl mb-8"
      />

      <h1 className="text-3xl font-bold text-pink-800 mb-3">
        {article.title}
      </h1>
      <p className="text-sm text-gray-500 mb-8">{article.category}</p>

      <div
        className="prose prose-pink max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}