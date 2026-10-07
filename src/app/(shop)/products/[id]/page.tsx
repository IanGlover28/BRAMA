import { notFound } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Star, Tag, Store, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductImage from "@/components/product-image";
import ProductPurchaseOptions from "@/components/product-purchase-options";
import ReviewSection from "@/components/review-section";
import StarRating from "@/components/star-rating";
import WishlistButton from "@/components/wishlist-button";

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [product, reviews] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.review.findMany({ where: { productId: id }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!product) {
    notFound();
  }

  // Only customers whose order for this product has been delivered may review it.
  let canReview = false;
  if (email) {
    const prismaUser = await prisma.user.findUnique({ where: { email } });
    if (prismaUser) {
      const deliveredOrders = await prisma.order.findMany({
        where: { userId: prismaUser.id, status: "DELIVERED" },
        select: { items: true },
      });
      canReview = deliveredOrders.some((order) =>
        Array.isArray(order.items)
          ? (order.items as { id: string }[]).some((item) => item.id === id)
          : false
      );
    }
  }

  const imageSrc =
    product.image?.startsWith("http") || product.image?.startsWith("/")
      ? product.image
      : `/${product.image}`;

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative h-[320px] sm:h-[420px] lg:h-[560px] bg-gradient-to-br from-pink-50 via-white to-pink-100/60 flex items-center justify-center overflow-hidden">
            <ProductImage src={imageSrc} alt={product.name} />

            {/* Wishlist heart */}
            <div className="absolute top-4 left-4 z-20">
              <WishlistButton productId={product.id} />
            </div>

            {/* BEST SELLER Badge */}
            {product.stock > 40 && (
              <span className="absolute top-4 right-4 z-20 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                BEST SELLER
              </span>
            )}

            {/* Category chip */}
            <span className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <Tag size={12} className="text-pink-600" />
              {product.category.replace(/-/g, " ")}
            </span>
          </div>

          {/* Product Details */}
          <div className="p-6 sm:p-10 flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 min-w-0">
              <Link href="/" className="hover:text-pink-600 transition-colors shrink-0">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-pink-600 transition-colors shrink-0">
                Products
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate">{product.name}</span>
            </nav>

            {product.brand && (
              <span className="self-start inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Store size={12} />
                {product.brand}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating ? (
              <div className="flex items-center gap-2 mb-4">
                <StarRating value={avgRating} size={16} />
                <span className="text-sm text-gray-500 font-medium">
                  {avgRating.toFixed(1)} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-medium text-gray-500">
                  {product.stock > 40 ? "New" : "Popular"}
                </span>
              </div>
            )}

            {/* Price & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-extrabold text-pink-600">
                ₵{product.price.toFixed(2)}
              </p>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 size={14} /> In stock
                </span>
              ) : (
                <span className="inline-flex items-center text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description ||
                "Premium .BRAMA product with top-tier quality and satisfaction guaranteed."}
            </p>

            <ProductPurchaseOptions product={product} />

            {/* Meta chips */}
            <div className="pt-6 mt-8 border-t border-gray-100 flex flex-wrap gap-2 text-xs font-medium text-gray-500">
              <span className="bg-gray-100 px-3 py-1.5 rounded-full">
                SKU: {product.id.slice(0, 8).toUpperCase()}
              </span>
              {product.brand && (
                <span className="bg-gray-100 px-3 py-1.5 rounded-full">
                  Brand: {product.brand}
                </span>
              )}
              <span className="bg-gray-100 px-3 py-1.5 rounded-full capitalize">
                Category: {product.category.replace(/-/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection
        productId={product.id}
        reviews={reviews}
        signedInEmail={email}
        signedInName={user?.fullName}
        canReview={canReview}
      />
    </div>
  );
}
