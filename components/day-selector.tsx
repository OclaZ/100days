"use client";

import { motion } from "framer-motion";
import { X, Heart, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DaySelectorProps {
  memories: any[];
  currentDay: number;
  onSelectDay: (dayIndex: number) => void;
  onClose: () => void;
}

export default function DaySelector({
  memories,
  currentDay,
  onSelectDay,
  onClose,
}: DaySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "milestones">("all");

  // Define milestone days - these are special days in the relationship
  const milestones = [0, 29, 49, 74, 89, 99]; // Day 1, 30, 50, 75, 90, 100

  // Filter memories based on search term
  const filteredMemories = memories.filter((memory) => {
    const searchString =
      `${memory.title} ${memory.description} Day ${memory.day} ${memory.date.monthName} ${memory.date.dayNumber}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Filter memories based on active tab
  const displayedMemories =
    activeTab === "milestones"
      ? filteredMemories.filter((_, index) => milestones.includes(index))
      : filteredMemories;

  // Group memories by month for better organization
  const groupedMemories = displayedMemories.reduce((groups, memory) => {
    const monthYear = `${memory.date.monthName} ${memory.date.year}`;
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(memory);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 text-white flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            <h2 className="text-xl font-bold">Select a Day</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Tabs */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className={
                activeTab === "all" ? "bg-pink-500 hover:bg-pink-600" : ""
              }
            >
              All Days
            </Button>
            <Button
              variant={activeTab === "milestones" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("milestones")}
              className={
                activeTab === "milestones"
                  ? "bg-pink-500 hover:bg-pink-600"
                  : ""
              }
            >
              Milestones
            </Button>
          </div>
        </div>

        {/* Days List */}
        <div className="overflow-y-auto max-h-[50vh] p-2">
          {Object.keys(groupedMemories).length > 0 ? (
            Object.entries(groupedMemories).map(
              ([monthYear, monthMemories]: [string, any[]]) => (
                <div key={monthYear} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 px-2 mb-2">
                    {monthYear}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {monthMemories.map((memory, memoryIndex) => {
                      // Find the original index in the full memories array
                      const originalIndex = memories.findIndex(
                        (m) =>
                          m.day === memory.day &&
                          m.date.dayNumber === memory.date.dayNumber &&
                          m.date.monthName === memory.date.monthName
                      );

                      const MemoryIcon = memory.icon;

                      return (
                        <div
                          key={memoryIndex}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            originalIndex === currentDay
                              ? "bg-pink-100 border-2 border-pink-500"
                              : "bg-white hover:bg-pink-50 border border-gray-200"
                          }`}
                          onClick={() => onSelectDay(originalIndex)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-500">
                              {memory.date.monthName} {memory.date.dayNumber}
                            </span>
                            <span className="text-sm font-bold text-pink-600">
                              Day {memory.day}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryIcon className="h-4 w-4 text-pink-500 flex-shrink-0" />
                            <h3 className="font-medium text-gray-800 truncate">
                              {memory.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {memory.description}
                          </p>

                          {/* Show heart icon for milestone days */}
                          {milestones.includes(originalIndex) && (
                            <div className="flex justify-end mt-1">
                              <Heart
                                className="h-4 w-4 text-pink-500"
                                fill="currentColor"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No memories found matching your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
