
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import {Product} from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/authOptions";

import CategoryDisplay from "@/components/category-display";



export default async function ProductsPage() {

  const session = await getServerSession(authOptions);

  if (!session) {

    redirect("/signup");

  }



  const products = await prisma.product.findMany();





  const productsByCategory = products.reduce(
    (acc: Record<string, Product[]>, product: Product) => {

    const category = product.category || 'Uncategorized';

    if (!acc[category]) {

      acc[category] = [];

    }

    acc[category].push(product);

    return acc;

  }, {});



  const categoryTitles = Object.keys(productsByCategory);



  return (

    <div className="min-h-screen bg-gray-50 p-8 pt-24"> 

      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">

        BRAMA&apos;s Collection 

      </h1>



      <div className="max-w-7xl mx-auto">

        {categoryTitles.length > 0 ? (

          categoryTitles.map((category) => (

            <CategoryDisplay

              key={category}

              title={category.replace(/-/g, ' ').toUpperCase()} 

              products={productsByCategory[category]}

            />

          ))

        ) : (

          <p className="text-gray-500 text-center text-xl mt-20">

            No products available yet. Check back soon!

          </p>

        )}

      </div>

    </div>

  );

}

