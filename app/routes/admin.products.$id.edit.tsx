import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);

  if (params.id && params.id !== "new") {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      throw new Response("Product Not Found", { status: 404 });
    }

    return json({ product });
  }

  return json({ product: null });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const price = formData.get("price");
  const description = formData.get("description");
  const features = formData.get("features");
  const previewImg = formData.get("previewImg");
  const downloadUrl = formData.get("downloadUrl");
  const whatsappUrl = formData.get("whatsappUrl");
  const isVisible = formData.get("isVisible") === "on";

  if (
    typeof name !== "string" ||
    typeof price !== "string" ||
    typeof description !== "string" ||
    typeof features !== "string" ||
    typeof previewImg !== "string" ||
    typeof downloadUrl !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const priceInt = parseInt(price);
  if (isNaN(priceInt)) {
    return json({ error: "Price must be a number" }, { status: 400 });
  }

  const featuresArray = features
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const data = {
    name,
    price: priceInt,
    description,
    features: featuresArray,
    previewImg,
    downloadUrl,
    whatsappUrl: typeof whatsappUrl === "string" && whatsappUrl ? whatsappUrl : null,
    isVisible,
  };

  if (params.id && params.id !== "new") {
    await prisma.product.update({
      where: { id: params.id },
      data,
    });
  } else {
    await prisma.product.create({ data });
  }

  return redirect("/admin/products");
}

export default function ProductForm() {
  const { product } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isNew = !product;

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Product" : "Edit Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (IDR) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={product?.price}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features * (one per line)</Label>
                <Textarea
                  id="features"
                  name="features"
                  defaultValue={product?.features.join("\n")}
                  rows={6}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewImg">Preview Image URL *</Label>
                <Input
                  id="previewImg"
                  name="previewImg"
                  type="url"
                  defaultValue={product?.previewImg}
                  placeholder="https://example.com/product-preview.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">Download URL *</Label>
                <Input
                  id="downloadUrl"
                  name="downloadUrl"
                  type="url"
                  defaultValue={product?.downloadUrl}
                  placeholder="https://drive.google.com/..."
                  required
                />
                <p className="text-xs text-zinc-500">This URL is hidden from public view</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">Custom WhatsApp URL (optional)</Label>
                <Input
                  id="whatsappUrl"
                  name="whatsappUrl"
                  type="url"
                  defaultValue={product?.whatsappUrl || ""}
                  placeholder="https://wa.me/..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  defaultChecked={product?.isVisible ?? true}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isVisible" className="cursor-pointer">
                  Visible in Shop
                </Label>
              </div>

              {actionData?.error && (
                <div className="text-sm text-red-500">{actionData.error}</div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isNew ? "Create Product" : "Update Product"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/products">Cancel</Link>
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
