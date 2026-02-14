"use client";

import { useNavigation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

export function ProgressBar() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 z-[100] origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
