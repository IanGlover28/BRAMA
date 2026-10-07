"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  from?: { x?: number; y?: number; scale?: number };
}

export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  from,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -40px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, x: from?.x ?? 0, y: from?.y ?? 0, scale: from?.scale ?? 1 },
        visible: { opacity: 1, x: 0, y: 0, scale: 1 },
      }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}