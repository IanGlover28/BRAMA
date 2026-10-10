import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MyReviews from "@/components/my-reviews";
import BackToAccount from "@/components/back-to-account";

export default async function ReviewsPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) redirect("/sign-in");

  const reviews = await prisma.review.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, name: true, image: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-bold mb-1">Ratings &amp; Reviews</h1>
        <p className="text-sm text-gray-500 mb-6">
          Reviews you&apos;ve written and how you can manage them.
        </p>
        <MyReviews initialReviews={reviews} />
      </div>
    </div>
  );
}