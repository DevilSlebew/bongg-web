import { Link } from "@remix-run/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "lucide-react";
import { formatDate } from "~/lib/utils";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    coverImage?: string;
    publishedAt?: Date | string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {post.coverImage && (
        <div className="aspect-video overflow-hidden bg-zinc-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-cyan-500 transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {post.publishedAt && (
          <div className="flex items-center text-sm text-zinc-500">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(post.publishedAt)}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="ghost" className="w-full">
          <Link to={`/blog/${post.slug}`}>Read More →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
