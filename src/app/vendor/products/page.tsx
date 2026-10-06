import { prisma } from "@/lib/prisma";
import ProductManager from "@/components/vendor/product-manager";

export default async function VendorProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProductManager initialProducts={products} />;
}
