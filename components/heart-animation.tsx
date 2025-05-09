"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeartAnimation() {
  const [hearts, setHearts] = useState<
    { id: number; x: number; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    // Create initial hearts
    const initialHearts = Array.from({ length: 50 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100, // random horizontal position (0-100%)
      size: Math.random() * 30 + 10, // random size (10-40px)
      delay: Math.random() * 2, // random delay (0-2s)
      duration: Math.random() * 10 + 15, // random duration (15-25s)
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-500"
          style={{
            left: `${heart.x}%`,
            bottom: "-50px",
            fontSize: `${heart.size}px`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: [0, 1, 0.8, 0],
            x: Math.sin(heart.id) * 100, // Sine wave motion
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
