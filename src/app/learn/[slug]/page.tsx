import { notFound } from "next/navigation";
import Image from "next/image";
import { tutorials } from "../data";

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
    <article className="max-w-3xl mx-auto py-16 px-6">
      <Image
        src={tutorial.image}
        alt={tutorial.title}
        width={900}
        height={400}
        className="w-full h-64 object-cover rounded-xl mb-8"
      />

      <h1 className="text-3xl font-bold text-pink-800 mb-3">{tutorial.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{tutorial.category}</p>

      {tutorial.video && (
        <div className="aspect-video mb-8 rounded-xl overflow-hidden">
          <iframe
            src={tutorial.video}
            title={tutorial.title}
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      <div
        className="prose prose-pink max-w-none"
        dangerouslySetInnerHTML={{ __html: tutorial.content }}
      />
    </article>
  );
}
