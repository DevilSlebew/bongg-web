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
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      throw new Response("Post Not Found", { status: 404 });
    }

    return json({ post });
  }

  return json({ post: null });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  const slug = formData.get("slug");
  const title = formData.get("title");
  const excerpt = formData.get("excerpt");
  const content = formData.get("content");
  const tags = formData.get("tags");
  const coverImage = formData.get("coverImage");
  const isPublished = formData.get("isPublished") === "on";

  if (
    typeof slug !== "string" ||
    typeof title !== "string" ||
    typeof excerpt !== "string" ||
    typeof content !== "string" ||
    typeof tags !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const tagsArray = tags
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const data = {
    slug,
    title,
    excerpt,
    content,
    tags: tagsArray,
    coverImage: typeof coverImage === "string" && coverImage ? coverImage : null,
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  };

  if (params.id && params.id !== "new") {
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...data,
        // Keep the original publishedAt if it was already published
        publishedAt:
          existingPost?.isPublished && !isPublished
            ? null
            : existingPost?.isPublished
            ? existingPost.publishedAt
            : data.publishedAt,
      },
    });
  } else {
    await prisma.blogPost.create({ data });
  }

  return redirect("/admin/blog");
}

export default function BlogForm() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isNew = !post;

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Post" : "Edit Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={post?.title}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={post?.slug}
                    placeholder="my-blog-post"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post?.excerpt}
                  rows={3}
                  placeholder="A brief summary of your post..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content * (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post?.content}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Write your blog post in markdown..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags * (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags.join(", ")}
                  placeholder="tutorial, javascript, react"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  defaultValue={post?.coverImage || ""}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  defaultChecked={post?.isPublished}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  Publish Post
                </Label>
              </div>

              {actionData?.error && (
                <div className="text-sm text-red-500">{actionData.error}</div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isNew ? "Create Post" : "Update Post"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/blog">Cancel</Link>
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
