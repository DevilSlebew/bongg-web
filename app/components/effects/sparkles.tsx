"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
  scale: number;
}

export function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const colors = ["#06b6d4", "#8b5cf6", "#10b981"];
    const newSparkles: Sparkle[] = [];

    for (let i = 0; i < 50; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        scale: 0.3 + Math.random() * 0.7,
      });
    }

    setSparkles(newSparkles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            backgroundColor: sparkle.color,
            width: 4 * sparkle.scale,
            height: 4 * sparkle.scale,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, sparkle.scale, 0],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
