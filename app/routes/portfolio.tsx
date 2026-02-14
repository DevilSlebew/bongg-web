import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { prisma } from "~/lib/db.server";
import { ProjectCard } from "~/components/portfolio/project-card";
import { ProjectFilter } from "~/components/portfolio/project-filter";

export const meta: MetaFunction = () => {
  return [
    { title: "Portfolio - BonggXz" },
    { name: "description", content: "Browse my portfolio of web, Roblox, and IoT projects" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "ALL";

  const projects = await prisma.project.findMany({
    where:
      category !== "ALL"
        ? {
            category: category as any,
          }
        : undefined,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return json({ projects });
}

export default function Portfolio() {
  const { projects } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("category") || "ALL";

  const handleFilterChange = (filter: string) => {
    if (filter === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
    }
  };

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
          Portfolio
        </h1>

        <div className="mb-8">
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  slug: project.slug,
                  title: project.title,
                  description: project.description,
                  category: project.category,
                  techStack: project.techStack,
                  images: project.images,
                  demoUrl: project.demoUrl || undefined,
                  repoUrl: project.repoUrl || undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
