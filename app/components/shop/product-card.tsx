"use client";

import { Card3D } from "~/components/effects/card-3d";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "~/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    previewImg: string;
    whatsappUrl?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hello BonggXz, I want to buy ${product.name} (${formatPrice(product.price)}). Here is my order details:`
  );
  const whatsappLink =
    product.whatsappUrl || `https://wa.me/6281234567890?text=${whatsappMessage}`;

  return (
    <Card3D className="h-full">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden bg-zinc-900">
            <img
              src={product.previewImg}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1">
          <CardTitle className="mb-2">{product.name}</CardTitle>
          <p className="text-3xl font-bold text-cyan-500 mb-4">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-zinc-400 mb-4">{product.description}</p>

          <div className="space-y-2">
            {product.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-300">{feature}</span>
              </div>
            ))}
            {product.features.length > 3 && (
              <p className="text-xs text-zinc-500">
                +{product.features.length - 3} more features
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Now
            </a>
          </Button>
        </CardFooter>
      </Card>
    </Card3D>
  );
}
