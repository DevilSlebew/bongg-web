import { BentoGrid, BentoGridItem } from "../effects/bento-grid";
import { Marquee } from "../effects/marquee";
import { Card } from "../ui/card";

const techStack = [
  "React",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Lua",
  "C++",
  "Arduino",
  "Remix",
  "Tailwind",
  "Prisma",
];

interface BentoShowcaseProps {
  latestProject?: {
    title: string;
    description: string;
    image: string;
  };
  latestBlog?: {
    title: string;
    excerpt: string;
  };
}

export function BentoShowcase({ latestProject, latestBlog }: BentoShowcaseProps) {
  return (
    <section className="container px-4 md:px-6 py-16">
      <BentoGrid>
        {/* About Me - Large Tile */}
        <BentoGridItem
          title="About Me"
          description="Student at MAN 1 Jepara"
          className="md:col-span-2"
        >
          <div className="mt-4 text-sm text-zinc-400">
            <p>
              I'm a passionate fullstack developer, Roblox scripter, and IoT engineer.
              Currently studying at MAN 1 Jepara, I specialize in building web applications,
              creating engaging Roblox games with Luau, and developing IoT projects with
              Arduino and C++.
            </p>
          </div>
        </BentoGridItem>

        {/* Tech Stack */}
        <BentoGridItem
          title="Tech Stack"
          className="md:col-span-1"
        >
          <Marquee pauseOnHover className="[--duration:20s]">
            {techStack.map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-mono text-cyan-500 whitespace-nowrap"
              >
                {tech}
              </div>
            ))}
          </Marquee>
        </BentoGridItem>

        {/* Latest Project */}
        <BentoGridItem
          title="Latest Project"
          description={latestProject?.title || "Check out my portfolio"}
          className="md:col-span-2"
        >
          {latestProject && (
            <div className="mt-4">
              <Card className="overflow-hidden">
                <img
                  src={latestProject.image}
                  alt={latestProject.title}
                  className="w-full h-32 object-cover"
                />
              </Card>
            </div>
          )}
        </BentoGridItem>

        {/* Latest Tutorial */}
        <BentoGridItem
          title="Latest Tutorial"
          description={latestBlog?.title || "Read my blog"}
          className="md:col-span-1"
        >
          {latestBlog && (
            <div className="mt-4">
              <p className="text-sm text-zinc-400 line-clamp-3">
                {latestBlog.excerpt}
              </p>
            </div>
          )}
        </BentoGridItem>
      </BentoGrid>
    </section>
  );
}
