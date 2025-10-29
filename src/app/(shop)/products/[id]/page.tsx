import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import Image from "next/image";
import ProductPurchaseOptions from "@/components/product-purchase-options";

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/signup");

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return (
      <div className="pt-32 p-8 text-center text-red-500">
        Product not found!
      </div>
    );
  }

  const imageSrc =
    product.image?.startsWith("http") || product.image?.startsWith("/")
      ? product.image
      : `/${product.image}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-50">
            <Image
              src={imageSrc || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain"
              priority={false}
              unoptimized
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8 p-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>

            <div className="flex items-baseline gap-4">
              <p className="text-5xl font-bold text-green-600">${product.price.toFixed(2)}</p>
              <span className="text-lg text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Premium Exortica product with top-tier quality and satisfaction guaranteed."}
              </p>
            </div>

            {/* 🔹 Purchase Options (bud/pre-roll, grams/ounces, qty, buy now) */}
            <ProductPurchaseOptions product={product} />

            <div className="pt-6 text-sm text-gray-500 space-y-2">
              <p>
                Category:{" "}
                <span className="font-medium text-gray-700">{product.category}</span>
              </p>
              <p>
                SKU:{" "}
                <span className="font-medium text-gray-700">
                  {product.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
