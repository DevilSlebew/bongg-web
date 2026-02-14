import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/lib/db.server";
import { ProductCard } from "~/components/shop/product-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Shop - BonggXz" },
    { name: "description", content: "Browse and purchase digital products" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
  });

  return json({ products });
}

export default function Shop() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
          Shop
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          Digital products, templates, and more
        </p>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  description: product.description,
                  features: product.features,
                  previewImg: product.previewImg,
                  whatsappUrl: product.whatsappUrl || undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
