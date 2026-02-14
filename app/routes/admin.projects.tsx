import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return json({ projects });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id");

  if (intent === "delete" && typeof id === "string") {
    await prisma.project.delete({ where: { id } });
    return redirect("/admin/projects");
  }

  return json({ success: true });
}

export default function AdminProjects() {
  const { projects } = useLoaderData<typeof loader>();
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
              Manage Projects
            </h1>
          </div>
          <Button asChild>
            <Link to="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-zinc-400 mb-4">No projects yet</p>
              <Button asChild>
                <Link to="/admin/projects/new">Create Your First Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                        {project.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button asChild size="icon" variant="outline">
                        <Link to={`/admin/projects/${project.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={project.id} />
                        <Button
                          type="submit"
                          size="icon"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this project?")) {
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
