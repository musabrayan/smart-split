"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  const rotateDirection = (current) => {
    const dirs = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const index = dirs.indexOf(current);
    const next = clockwise
      ? (index - 1 + dirs.length) % dirs.length
      : (index + 1) % dirs.length;
    return dirs[next];
  };

  // Use themed white foreground via `--foreground`
  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, var(--foreground) 0%, transparent 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, var(--foreground) 0%, transparent 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, var(--foreground) 0%, transparent 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, var(--foreground) 0%, transparent 100%)",
  };

  const highlight =
    "radial-gradient(75% 181% at 50% 50%, var(--primary) 0%, transparent 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex w-fit h-min p-px items-center justify-center overflow-visible rounded-full border bg-primary/20 hover:bg-primary/10 transition duration-500 dark:bg-muted/30",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "z-10 rounded-[inherit] px-4 py-2 text-sm font-medium text-foreground bg-background",
          className
        )}
      >
        {children}
      </div>

      <motion.div
        className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />

      {/* Inner background for depth, theme-aware */}
      <div className="absolute inset-[2px] z-[1] rounded-[inherit] bg-background" />
    </Tag>
  );
}
