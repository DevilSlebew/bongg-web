import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/lib/db.server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.project) {
    return [{ title: "Project Not Found - BonggXz" }];
  }
  return [
    { title: `${data.project.title} - BonggXz` },
    { name: "description", content: data.project.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    throw new Response("Project Not Found", { status: 404 });
  }

  return json({ project });
}

export default function ProjectDetail() {
  const { project } = useLoaderData<typeof loader>();

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>

        <div className="space-y-8">
          <div>
            <Badge variant="secondary" className="mb-4">
              {project.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {project.title}
            </h1>
            <p className="text-xl text-zinc-400">{project.description}</p>
          </div>

          {project.images.length > 0 && (
            <div className="space-y-4">
              {project.images.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button asChild size="lg">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild size="lg" variant="outline">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-500">
          Project Not Found
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          The project you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    </div>
  );
}
