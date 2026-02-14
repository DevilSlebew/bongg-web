import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Hero } from "~/components/sections/hero";
import { BentoShowcase } from "~/components/sections/bento-showcase";
import { prisma } from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "BonggXz - Fullstack Developer & IoT Enthusiast" },
    {
      name: "description",
      content:
        "Personal website of BonggXz - Fullstack Developer, Roblox Scripter, and IoT Engineer. Check out my projects and tutorials.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const [latestProject, latestBlog] = await Promise.all([
    prisma.project.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.findFirst({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return json({
    latestProject: latestProject
      ? {
          title: latestProject.title,
          description: latestProject.description,
          image: latestProject.images[0] || "/placeholder.jpg",
        }
      : null,
    latestBlog: latestBlog
      ? {
          title: latestBlog.title,
          excerpt: latestBlog.excerpt,
        }
      : null,
  });
}

export default function Index() {
  const { latestProject, latestBlog } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <BentoShowcase latestProject={latestProject} latestBlog={latestBlog} />
    </div>
  );
}
