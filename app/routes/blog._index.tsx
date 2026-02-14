import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { prisma } from "~/lib/db.server";
import { BlogCard } from "~/components/blog/blog-card";
import { Badge } from "~/components/ui/badge";

export const meta: MetaFunction = () => {
  return [
    { title: "Blog - BonggXz" },
    { name: "description", content: "Read tutorials and articles about web development, Roblox scripting, and IoT" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");

  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  // Get all unique tags
  const allPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });

  const tagsSet = new Set<string>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  const tags = Array.from(tagsSet).sort();

  return json({ posts, tags, activeTag: tag });
}

export default function BlogIndex() {
  const { posts, tags, activeTag } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();

  const handleTagClick = (tag: string) => {
    if (tag === activeTag) {
      setSearchParams({});
    } else {
      setSearchParams({ tag });
    }
  };

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          Tutorials, articles, and thoughts on tech
        </p>

        {tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-3">Filter by tag:</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tag === activeTag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400">
              {activeTag ? `No posts found with tag "${activeTag}".` : "No posts available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  tags: post.tags,
                  coverImage: post.coverImage || undefined,
                  publishedAt: post.publishedAt || undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
