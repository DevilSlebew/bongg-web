import { cn } from "~/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoGridItemProps {
  title?: string;
  description?: string;
  header?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  className,
  children,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-zinc-900 dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {title && (
          <div className="font-sans font-bold text-foreground mb-2 mt-2">
            {title}
          </div>
        )}
        {description && (
          <div className="font-sans font-normal text-muted-foreground text-xs">
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
