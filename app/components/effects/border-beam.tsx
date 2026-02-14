"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#06b6d4",
  colorTo = "#8b5cf6",
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-lg",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
          opacity: 0,
        }}
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
      />
    </div>
  );
}
