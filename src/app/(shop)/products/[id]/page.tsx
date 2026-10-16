import { cache } from "react";
import type { Metadata } from "next";
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
import JsonLd from "@/components/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Shared by generateMetadata and the page so the product is fetched once per request.
const getProduct = cache((id: string) => prisma.product.findUnique({ where: { id } }));

function productImageSrc(image: string | null | undefined) {
  return image?.startsWith("http") || image?.startsWith("/") ? image : `/${image}`;
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const description =
    product.description.length > 155
      ? `${product.description.slice(0, 152).trimEnd()}...`
      : product.description;
  const image = productImageSrc(product.image);

  return {
    title: product.brand ? `${product.name} by ${product.brand}` : product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `/products/${product.id}`,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [product, reviews] = await Promise.all([
    getProduct(id),
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

  const imageSrc = productImageSrc(product.image);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const productUrl = `${SITE_URL}/products/${product.id}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageSrc.startsWith("http") ? imageSrc : `${SITE_URL}${imageSrc}`,
    sku: product.id,
    category: product.category,
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GHS",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    ...(avgRating !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-ink-50 pt-24 pb-16 px-4">
      <JsonLd data={productJsonLd} />
      <div className="max-w-6xl mx-auto bg-surface rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative h-[320px] sm:h-[420px] lg:h-[560px] bg-gradient-to-br from-brand-50 via-surface to-brand-100/60 flex items-center justify-center overflow-hidden">
            <ProductImage src={imageSrc} alt={product.name} />

            {/* Wishlist heart */}
            <div className="absolute top-4 left-4 z-20">
              <WishlistButton productId={product.id} />
            </div>

            {/* BEST SELLER Badge */}
            {product.stock > 40 && (
              <span className="absolute top-4 right-4 z-20 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                BEST SELLER
              </span>
            )}

            {/* Category chip */}
            <span className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 bg-surface/80 backdrop-blur-sm text-ink-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <Tag size={12} className="text-brand-600" />
              {product.category.replace(/-/g, " ")}
            </span>
          </div>

          {/* Product Details */}
          <div className="p-6 sm:p-10 flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav className="text-xs text-ink-500 mb-4 flex items-center gap-1.5 min-w-0">
              <Link href="/" className="hover:text-brand-600 transition-colors shrink-0">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-brand-600 transition-colors shrink-0">
                Products
              </Link>
              <span>/</span>
              <span className="text-ink-700 font-medium truncate">{product.name}</span>
            </nav>

            {product.brand && (
              <span className="self-start inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Store size={12} />
                {product.brand}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating ? (
              <div className="flex items-center gap-2 mb-4">
                <StarRating value={avgRating} size={16} />
                <span className="text-sm text-ink-500 font-medium">
                  {avgRating.toFixed(1)} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-medium text-ink-500">
                  {product.stock > 40 ? "New" : "Popular"}
                </span>
              </div>
            )}

            {/* Price & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-extrabold text-brand-600">
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
            <p className="text-ink-600 leading-relaxed mb-8">
              {product.description ||
                "Premium .BRAMA product with top-tier quality and satisfaction guaranteed."}
            </p>

            <ProductPurchaseOptions product={product} />

            {/* Meta chips */}
            <div className="pt-6 mt-8 border-t border-ink-100 flex flex-wrap gap-2 text-xs font-medium text-ink-500">
              <span className="bg-ink-100 px-3 py-1.5 rounded-full">
                SKU: {product.id.slice(0, 8).toUpperCase()}
              </span>
              {product.brand && (
                <span className="bg-ink-100 px-3 py-1.5 rounded-full">
                  Brand: {product.brand}
                </span>
              )}
              <span className="bg-ink-100 px-3 py-1.5 rounded-full capitalize">
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
