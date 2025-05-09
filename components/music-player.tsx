"use client";

import { useState, useEffect, useRef } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio("/love.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = volume;

      // Auto-play on first visit (with user interaction)
      const handleFirstInteraction = () => {
        onToggle();
        document.removeEventListener("click", handleFirstInteraction);
      };

      document.addEventListener("click", handleFirstInteraction, {
        once: true,
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        document.removeEventListener("click", handleFirstInteraction);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isExpanded
          ? "bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${
            isPlaying ? "bg-pink-100 text-pink-600" : "bg-white/80"
          }`}
          onClick={() => {
            onToggle();
            setIsExpanded(true);
          }}
        >
          {isPlaying ? (
            <Music className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-300">
            <Volume2 className="h-4 w-4 text-pink-600" />
            <Slider
              className="w-24"
              defaultValue={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
            <span className="text-xs text-pink-600 font-medium">
              {isPlaying ? "Now Playing" : "Paused"}
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="text-xs text-center mt-2 text-pink-600">
          ♫ Amadou & Mariam - Je pense à toi ♫
        </div>
      )}
    </div>
  );
}
