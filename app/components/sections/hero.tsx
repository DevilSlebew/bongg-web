"use client";

import { useState } from "react";
import { Sparkles } from "../effects/sparkles";
import { Typewriter } from "../effects/typewriter";
import { Button } from "../ui/button";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

export function Hero() {
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Sparkles />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                <Typewriter
                  text="BonggXz"
                  delay={150}
                  onComplete={() => setTypewriterComplete(true)}
                />
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: typewriterComplete ? 1 : 0, y: typewriterComplete ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-[700px] text-zinc-400 md:text-xl"
            >
              Fullstack Dev | Roblox Scripter | IoT Engineer
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: typewriterComplete ? 1 : 0, y: typewriterComplete ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              <Link to="/portfolio">View Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`https://wa.me/${process.env.WHATSAPP_NUMBER || '6281234567890'}`} target="_blank" rel="noopener noreferrer">
                Contact Me
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
