import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);

  if (params.id && params.id !== "new") {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      throw new Response("Project Not Found", { status: 404 });
    }

    return json({ project });
  }

  return json({ project: null });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  const slug = formData.get("slug");
  const title = formData.get("title");
  const category = formData.get("category");
  const description = formData.get("description");
  const techStack = formData.get("techStack");
  const images = formData.get("images");
  const demoUrl = formData.get("demoUrl");
  const repoUrl = formData.get("repoUrl");
  const isFeatured = formData.get("isFeatured") === "on";

  if (
    typeof slug !== "string" ||
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof description !== "string" ||
    typeof techStack !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const techStackArray = techStack
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const imagesArray = typeof images === "string"
    ? images
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const data = {
    slug,
    title,
    category: category as any,
    description,
    techStack: techStackArray,
    images: imagesArray,
    demoUrl: typeof demoUrl === "string" && demoUrl ? demoUrl : null,
    repoUrl: typeof repoUrl === "string" && repoUrl ? repoUrl : null,
    isFeatured,
  };

  if (params.id && params.id !== "new") {
    await prisma.project.update({
      where: { id: params.id },
      data,
    });
  } else {
    await prisma.project.create({ data });
  }

  return redirect("/admin/projects");
}

export default function ProjectForm() {
  const { project } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isNew = !project;

  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Project" : "Edit Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={project?.title}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={project?.slug}
                    placeholder="my-awesome-project"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" defaultValue={project?.category || "WEB"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEB">Web</SelectItem>
                    <SelectItem value="ROBLOX">Roblox</SelectItem>
                    <SelectItem value="IOT">IoT</SelectItem>
                    <SelectItem value="DESIGN">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project?.description}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack * (comma separated)</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  defaultValue={project?.techStack.join(", ")}
                  placeholder="React, TypeScript, Node.js"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  name="images"
                  defaultValue={project?.images.join("\n")}
                  rows={4}
                  placeholder="https://example.com/image1.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    name="demoUrl"
                    type="url"
                    defaultValue={project?.demoUrl || ""}
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repoUrl">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    name="repoUrl"
                    type="url"
                    defaultValue={project?.repoUrl || ""}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={project?.isFeatured}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured Project
                </Label>
              </div>

              {actionData?.error && (
                <div className="text-sm text-red-500">{actionData.error}</div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isNew ? "Create Project" : "Update Project"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/projects">Cancel</Link>
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
