"use client";;
import React from "react";
import { motion } from "motion/react";

export const Spotlight = ({
  gradientFirst = `radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(25, 173, 116, 0.08) 0%, rgba(25, 173, 116, 0.02) 50%, rgba(25, 173, 116, 0) 80%)`,
  gradientSecond = `radial-gradient(50% 50% at 50% 50%, rgba(25, 173, 116, 0.06) 0%, rgba(25, 173, 116, 0.02) 80%, transparent 100%)`,
  gradientThird = `radial-gradient(50% 50% at 50% 50%, rgba(25, 173, 116, 0.04) 0%, rgba(25, 173, 116, 0.02) 80%, transparent 100%)`,
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100
} = {}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="pointer-events-none absolute inset-0 h-full w-full">
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none">
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0`} />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`} />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`} />
      </motion.div>
      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none">
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0`} />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`} />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`} />
      </motion.div>
    </motion.div>
  );
};
