"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

export default function Confetti() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({ width, height });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={true}
      numberOfPieces={200}
      colors={["#F472B6", "#EC4899", "#DB2777", "#BE185D", "#FBCFE8"]}
    />
  );
}
