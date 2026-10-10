import StarRating from "@/components/star-rating";
import ReviewForm from "@/components/review-form";

interface ReviewData {
  id: string;
  email: string;
  name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
}

export default function ReviewSection({
  productId,
  reviews,
  signedInEmail,
  signedInName,
  canReview,
}: {
  productId: string;
  reviews: ReviewData[];
  signedInEmail: string | undefined;
  signedInName: string | null | undefined;
  canReview: boolean;
}) {
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const alreadyReviewed = signedInEmail
    ? reviews.some((r) => r.email === signedInEmail)
    : false;

  return (
    <section className="max-w-6xl mx-auto p-6 mt-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings &amp; Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-extrabold text-gray-900">
            {average.toFixed(1)}
          </span>
          <div>
            <StarRating value={average} />
            <p className="text-xs text-gray-500 mt-1">
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} />
                <span className="font-semibold text-sm text-gray-900">
                  {review.name || review.email.split("@")[0] || "Customer"}
                </span>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && (
              <p className="mt-2 font-semibold text-gray-800 text-sm">{review.title}</p>
            )}
            {review.body && <p className="mt-1 text-sm text-gray-600">{review.body}</p>}
          </li>
        ))}
      </ul>

      {signedInEmail &&
        (alreadyReviewed ? (
          <p className="text-sm text-gray-500 mt-5">You&apos;ve already reviewed this product.</p>
        ) : canReview ? (
          <div className="border-t border-gray-100 mt-6 pt-4">
            <h3 className="font-bold text-gray-900">Write a Review</h3>
            <ReviewForm productId={productId} userName={signedInName ?? null} />
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-5">
            Reviews are available for products from a delivered order.
          </p>
        ))}
    </section>
  );
}