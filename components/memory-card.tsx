"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  day: number;
  date: string;
  icon: LucideIcon;
  isRevealed: boolean;
  onClick: () => void;
}

export default function MemoryCard({
  day,
  date,
  icon: Icon,
  isRevealed,
  onClick,
}: MemoryCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "aspect-square cursor-pointer rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-300",
        isRevealed
          ? "bg-gradient-to-br from-pink-400 to-red-400 text-white"
          : "bg-white hover:bg-pink-50 text-pink-500 border border-pink-200"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div className="text-lg font-bold">{day}</div>
      <div className="text-xs mt-1">{date}</div>
      <Icon
        className={cn(
          "mt-1 transition-all",
          isRevealed ? "opacity-100" : "opacity-0",
          isHovering && !isRevealed ? "opacity-30" : ""
        )}
        size={20}
      />
    </motion.div>
  );
}
