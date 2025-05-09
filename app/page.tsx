"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/ui/confetti";
import MusicPlayer from "@/components/music-player";
import { memories } from "@/data/memories";
import HeartAnimation from "@/components/heart-animation";
import DaySelector from "@/components/day-selector";

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pageSound] = useState(() =>
    typeof Audio !== "undefined" ? new Audio("/page-flip.mp3") : null
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showLoveSurprise, setShowLoveSurprise] = useState(false);
  const [showDaySelector, setShowDaySelector] = useState(false);

  const playPageSound = () => {
    if (pageSound) {
      pageSound.currentTime = 0;
      pageSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const goToNextDay = () => {
    if (isFlipping) return;

    if (currentIndex < memories.length - 1) {
      setDirection(1);
      setIsFlipping(true);
      playPageSound();

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipping(false);

        // Show love surprise when reaching the last day
        if (currentIndex + 1 === memories.length - 1) {
          setTimeout(() => {
            setShowConfetti(true);
            setShowLoveSurprise(true);
            // Play a special sound for the surprise
            const surpriseSound = new Audio("/surprise-sound.mp3");
            surpriseSound
              .play()
              .catch((e) => console.log("Audio play failed:", e));
          }, 1000);
        }
      }, 600);
    }
  };

  const goToPrevDay = () => {
    if (isFlipping) return;

    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipping(true);
      playPageSound();

      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToSpecificDay = (dayIndex: number) => {
    if (isFlipping || dayIndex === currentIndex) return;

    setDirection(dayIndex > currentIndex ? 1 : -1);
    setIsFlipping(true);
    playPageSound();
    setShowDaySelector(false);

    setTimeout(() => {
      setCurrentIndex(dayIndex);
      setIsFlipping(false);

      // Show love surprise when jumping to the last day
      if (dayIndex === memories.length - 1) {
        setTimeout(() => {
          setShowConfetti(true);
          setShowLoveSurprise(true);
          // Play a special sound for the surprise
          const surpriseSound = new Audio("/surprise-sound.mp3");
          surpriseSound
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        }, 1000);
      }
    }, 600);
  };

  if (memories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const memory = memories[currentIndex];
  const nextMemory =
    currentIndex < memories.length - 1 ? memories[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[url('/love-bg.png')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Music player */}
      <MusicPlayer
        isPlaying={isMusicPlaying}
        onToggle={() => setIsMusicPlaying(!isMusicPlaying)}
      />

      {/* Heart animation that shows when love surprise is active */}
      {showLoveSurprise && <HeartAnimation />}

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {showConfetti && <Confetti />}

      <header className="text-center mb-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2 drop-shadow-md">
          Our 100 Days of Love
        </h1>
        <p className="text-lg text-pink-600 bg-white/70 px-4 py-1 rounded-full backdrop-blur-sm">
          Starting January 29th ❤️
        </p>
      </header>

      <div className="relative w-full max-w-md mx-auto perspective-1000">
        {/* Calendar stand */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[98%] w-[70%] h-16 bg-gradient-to-b from-[#8B4513] to-[#5D2906] rounded-b-lg shadow-lg z-0"></div>

        <div className="relative">
          {/* Next page peeking from behind (only show when not on last page) */}
          {nextMemory && !isFlipping && (
            <div className="absolute top-0 left-0 w-full h-full z-0 transform translate-y-[5px]">
              <div className="w-full aspect-[3/4] shadow-md border-2 border-gray-200 bg-white rounded-sm"></div>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{
                rotateX: direction > 0 ? -90 : 90,
                y: direction > 0 ? -20 : 20,
                opacity: 0,
                scale: 1,
                originY: direction > 0 ? 0 : 1,
              }}
              animate={{
                rotateX: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                rotateX: direction > 0 ? 90 : -90,
                y: direction > 0 ? 20 : -20,
                opacity: 0,
                scale: 1,
                originY: direction > 0 ? 1 : 0,
                transition: { duration: 0.6 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6,
              }}
              className="w-full perspective-1000 z-10 relative"
              onClick={goToNextDay}
            >
              <div className="w-full aspect-[3/4] shadow-xl border-2 border-gray-200 flex flex-col cursor-pointer hover:shadow-2xl transition-shadow duration-300 overflow-hidden bg-[#FFFAF0] relative rounded-sm">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

                {/* Calendar top binding */}
                <div className="h-8 bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-red-800"></div>
                  <div className="flex w-full justify-center">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-2 bg-white mx-1 rounded-b-sm"
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Calendar content */}
                <div className="flex-1 flex flex-col items-center justify-between p-6 text-center relative">
                  {/* Decorative corner hearts */}
                  <div className="absolute top-2 left-2 text-red-500 opacity-70">
                    ❤️
                  </div>
                  <div className="absolute top-2 right-2 text-red-500 opacity-70">
                    ❤️
                  </div>
                  <div className="absolute bottom-2 left-2 text-red-500 opacity-70">
                    ❤️
                  </div>
                  <div className="absolute bottom-2 right-2 text-red-500 opacity-70">
                    ❤️
                  </div>

                  {/* Decorative border */}
                  <div className="absolute inset-4 border-2 border-red-200 border-dashed rounded-lg pointer-events-none"></div>

                  <div className="text-2xl font-bold text-red-700 mt-4 drop-shadow-sm">
                    {memory.date.monthName}
                  </div>

                  <div className="text-9xl font-bold my-4 text-red-900 drop-shadow-md font-serif">
                    {memory.date.dayNumber}
                  </div>

                  <div className="text-2xl font-bold text-red-700 mb-2 drop-shadow-sm">
                    {memory.date.dayName}
                  </div>

                  <div className="text-sm text-red-600">{memory.date.year}</div>

                  <div className="mt-6 border-t-2 border-red-200 pt-6 w-full">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-pink-100">
                      <h3 className="text-xl font-bold text-pink-600 mb-2 flex items-center justify-center">
                        <Heart className="mr-2" size={20} fill="currentColor" />
                        Day {memory.day}: {memory.title}
                        <Heart className="ml-2" size={20} fill="currentColor" />
                      </h3>
                      <p className="text-gray-700">{memory.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-4 text-red-500">
                    <Heart size={16} fill="currentColor" className="mr-1" />
                    <Heart size={20} fill="currentColor" className="mx-1" />
                    <Heart size={16} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-6 relative z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevDay}
            disabled={currentIndex === 0}
            className="rounded-full border-pink-300 bg-white/80 text-pink-600 hover:bg-pink-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <div className="text-pink-600 font-medium bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">
              Day {memory.day} of 100
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowDaySelector(true)}
              className="rounded-full border-pink-300 bg-white/80 text-pink-600 hover:bg-pink-100"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
            disabled={currentIndex === memories.length - 1}
            className="rounded-full border-pink-300 bg-white/80 text-pink-600 hover:bg-pink-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <footer className="py-6 text-center text-pink-600 mt-8 bg-white/70 px-4 rounded-full backdrop-blur-sm relative z-10">
        <p>Made with ❤️ for our 100 days together</p>
      </footer>

      {/* Day Selector Modal */}
      <AnimatePresence>
        {showDaySelector && (
          <DaySelector
            memories={memories}
            currentDay={currentIndex}
            onSelectDay={goToSpecificDay}
            onClose={() => setShowDaySelector(false)}
          />
        )}
      </AnimatePresence>

      {/* Love Surprise Modal */}
      {showLoveSurprise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.8,
            }}
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden relative"
          >
            {/* Floating hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, x: 0, opacity: 0 }}
                  animate={{
                    y: -Math.random() * 500,
                    x: (Math.random() - 0.5) * 200,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                  className="absolute text-red-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: `-20px`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 text-white text-center">
              <h2 className="text-2xl font-bold">100 Days of Love</h2>
              <p className="text-white/80">A special message for you</p>
            </div>

            {/* Content */}
            <div className="p-6 bg-[url('/paper-texture.png')] bg-white">
              <div className="border-2 border-pink-200 border-dashed p-6 rounded-lg">
                <h3 className="text-xl font-bold text-pink-600 mb-4 text-center">
                  Ma pucheee 🍑,
                </h3>

                <p className="text-gray-700 mb-4 italic">
                  These 100 days have been the most beautiful days of my life.
                  Every moment with you feels like a dream come true.
                </p>

                <p className="text-gray-700 mb-4">
                  From our first day together on January 29th to today, you've
                  filled my life with joy, laughter, and love. Each day has been
                  a new adventure, and I've cherished every single one.
                </p>

                <p className="text-gray-700 mb-4">
                  This calendar holds just a fraction of our memories together,
                  but my heart holds so much more. Thank you for being you, for
                  your smile that brightens my day, for your kindness, and for
                  your love.
                </p>

                <p className="text-gray-700 mb-6">
                  I can't wait to create countless more memories with you.
                  Here's to the next 100 days, and the next 100 after that, and
                  forever.
                </p>

                <p className="text-pink-600 font-bold text-right">
                  I Loooooove you,
                </p>
                <p className="text-pink-600 font-bold text-right">Hmizooo</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-pink-50 p-4 flex justify-center">
              <Button
                onClick={() => setShowLoveSurprise(false)}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
              >
                <Heart className="mr-2 h-4 w-4" fill="currentColor" /> Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
