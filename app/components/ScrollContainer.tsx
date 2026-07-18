"use client";

import React, { useRef, useState, useEffect } from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  itemCount: number;
}

export default function ScrollContainer({ children, className = "", itemCount }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    // Show left arrow if we have scrolled right at all
    setShowLeftArrow(scrollLeft > 5);
    // Show right arrow if we can scroll more to the right (with a buffer)
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScroll();

    // Check scroll state when window resizes
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(container);

    container.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", checkScroll);
      resizeObserver.disconnect();
    };
  }, [itemCount]);

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // If there are 3 or fewer items, we use the original responsive grid layout directly.
  if (itemCount <= 3) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="group/scroll relative w-full">
      {/* Left Navigation Arrow */}
      <button
        onClick={() => handleScroll("left")}
        className={`absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e0dacb] bg-white/95 p-3 text-[#1e2c26] shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#e7c765] hover:text-[#173328] hover:scale-110 active:scale-95 md:flex items-center justify-center hidden ${
          showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => handleScroll("right")}
        className={`absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e0dacb] bg-white/95 p-3 text-[#1e2c26] shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#e7c765] hover:text-[#173328] hover:scale-110 active:scale-95 md:flex items-center justify-center hidden ${
          showRightArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex w-full gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}
