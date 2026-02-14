import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { formatDate } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return json({ posts });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id");

  if (intent === "delete" && typeof id === "string") {
    await prisma.blogPost.delete({ where: { id } });
    return redirect("/admin/blog");
  }

  return json({ success: true });
}

export default function AdminBlog() {
  const { posts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              Manage Blog
            </h1>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-zinc-400 mb-4">No blog posts yet</p>
              <Button asChild>
                <Link to="/admin/blog/new">Create Your First Post</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        {post.isPublished ? (
                          <Badge variant="default" className="bg-emerald-500">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {post.publishedAt && (
                        <p className="text-xs text-zinc-500">
                          Published: {formatDate(post.publishedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button asChild size="icon" variant="outline">
                        <Link to={`/admin/blog/${post.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={post.id} />
                        <Button
                          type="submit"
                          size="icon"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this post?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
