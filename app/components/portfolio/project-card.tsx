import { Link } from "@remix-run/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  project: {
    slug: string;
    title: string;
    description: string;
    category: string;
    techStack: string[];
    images: string[];
    demoUrl?: string;
    repoUrl?: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden bg-zinc-900">
          {project.images[0] ? (
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              No Image
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="secondary" className="mb-3">
            {project.category}
          </Badge>
        </div>
        <CardTitle className="mb-2 line-clamp-1">{project.title}</CardTitle>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.techStack.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild className="flex-1" variant="default">
          <Link to={`/portfolio/${project.slug}`}>View Details</Link>
        </Button>
        {project.demoUrl && (
          <Button asChild size="icon" variant="outline">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button asChild size="icon" variant="outline">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
