import { Github, Instagram, Youtube } from "lucide-react";
import { Button } from "../ui/button";

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/bonggxz" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/bonggxz" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@bonggxz" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 BonggXz. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.name}
                variant="ghost"
                size="icon"
                asChild
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="hover:text-cyan-500"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
