import type { MetaFunction } from "@remix-run/node";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "About - BonggXz" },
    { name: "description", content: "Learn more about BonggXz" },
  ];
};

export default function About() {
  return (
    <div className="container px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
          About Me
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Who I Am</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400 space-y-4">
              <p>
                Hi! I'm BonggXz, a passionate fullstack developer and IoT enthusiast
                currently studying at MAN 1 Jepara. I love building things that live
                on the internet and creating physical computing projects.
              </p>
              <p>
                My journey in tech started with curiosity about how things work, and
                it has evolved into a deep passion for creating innovative solutions
                across different domains.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Web Development</h3>
                <p>
                  Fullstack web development using modern technologies like React,
                  TypeScript, Node.js, and MongoDB. I build responsive, performant
                  web applications with clean, maintainable code.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Roblox Development</h3>
                <p>
                  Creating engaging Roblox games and experiences using Luau scripting.
                  From game mechanics to UI systems, I bring ideas to life on the
                  Roblox platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">IoT Engineering</h3>
                <p>
                  Designing and building IoT projects with Arduino and C++. I create
                  smart devices and embedded systems that solve real-world problems.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              <p className="text-sm text-zinc-400">
                Want to work together or just chat about tech? Feel free to reach out!
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  <a href="mailto:bonggxz@example.com" className="text-cyan-500 hover:underline">
                    bonggxz@example.com
                  </a>
                  {" "}(Update this in the About page)
                </p>
                <p>
                  <span className="font-semibold text-foreground">GitHub:</span>{" "}
                  <a
                    href="https://github.com/bonggxz"
                    className="text-cyan-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @bonggxz
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
